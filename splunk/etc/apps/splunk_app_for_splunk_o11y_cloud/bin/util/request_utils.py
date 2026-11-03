import json
import re
from http import HTTPStatus
from http.client import HTTPException
from typing import Optional, Tuple

O11Y_REALM_REGEX = r'^[a-z]{1,3}[0-9]?$'  # regex to match o11y realms

_GRAPHQL_DISALLOW_MSG = 'GraphQL mutations and subscriptions are not allowed'


class RequestValidationException(HTTPException):
    def __init__(self, message, status_code=HTTPStatus.BAD_REQUEST):
        super().__init__(status_code)
        self.status_code = status_code
        self.message = message


class InvalidRequestMethodException(RequestValidationException):
    def __init__(self, message='Http method not allowed'):
        super().__init__(message, status_code=HTTPStatus.METHOD_NOT_ALLOWED)


class GraphQLScanError(ValueError):
    """Malformed GraphQL document during security scan (stdlib-only parser)."""


def _is_name_char(c: str) -> bool:
    return c.isalnum() or c == '_'


def _is_name_start(c: str) -> bool:
    return c.isalpha() or c == '_'


def _skip_whitespace_and_commas(s: str, i: int) -> int:
    n = len(s)
    while i < n and s[i] in ' \t\n\r,':
        i += 1
    return i


def _keyword_at(s: str, i: int, kw: str) -> bool:
    if not s.startswith(kw, i):
        return False
    j = i + len(kw)
    if j < len(s) and _is_name_char(s[j]):
        return False
    return True


def _skip_name(s: str, i: int) -> int:
    n = len(s)
    if i >= n or not _is_name_start(s[i]):
        raise GraphQLScanError('Expected name')
    i += 1
    while i < n and _is_name_char(s[i]):
        i += 1
    return i


def _graphql_strip_string_body(src: str, i: int, out: list, closing: str) -> int:
    """Copy string contents from src[i] as spaces until closing delimiter; return index past closing."""
    n = len(src)
    clen = len(closing)
    while i < n:
        # Escape sequences are two source characters; emit two spaces so output indices stay aligned with src.
        if src[i] == '\\' and i + 1 < n:
            out.extend((' ', ' '))
            i += 2
            continue
        # End of this string literal (block """...""" or ordinary "...").
        if src.startswith(closing, i):
            return i + clen
        # Any other character inside the literal is replaced by a single space (structure hidden from outer scan).
        out.append(' ')
        i += 1
    return i


def _graphql_strip_comments_and_strings(src: str) -> str:
    """Replace comments and string literals with spaces so braces/parens match executable structure."""
    out = []
    i, n = 0, len(src)
    while i < n:
        # GraphQL line comment: replace '#'..before newline with spaces; leave newline for next iteration.
        if src[i] == '#':
            while i < n and src[i] != '\n':
                out.append(' ')
                i += 1
            continue
        # Block string literal — must come before single-quote branch so """ is not parsed as three empty "" strings.
        if i + 2 < n and src.startswith('"""', i):
            i = _graphql_strip_string_body(src, i + 3, out, '"""')
            continue
        # Ordinary double-quoted string (cannot start block strings; those matched above).
        if src[i] == '"':
            i = _graphql_strip_string_body(src, i + 1, out, '"')
            continue
        # Outside comments/strings: preserve braces, keywords, etc. for the outer GraphQL structure scan.
        out.append(src[i])
        i += 1
    return ''.join(out)


def _skip_balanced_delimiters(
    s: str, i: int, opening_delimiter: str, closing_delimiter: str
) -> int:
    if i >= len(s) or s[i] != opening_delimiter:
        raise GraphQLScanError('Expected balanced pair')
    depth = 0
    n = len(s)
    while i < n:
        c = s[i]
        if c == opening_delimiter:
            depth += 1
        elif c == closing_delimiter:
            depth -= 1
            i += 1
            if depth == 0:
                return i
            continue
        i += 1
    raise GraphQLScanError('Unclosed bracket')


def _skip_braced_block(s: str, i: int) -> int:
    return _skip_balanced_delimiters(s, i, '{', '}')


def _skip_directive(s: str, i: int) -> int:
    if i >= len(s) or s[i] != '@':
        raise GraphQLScanError('Expected directive')
    i += 1
    i = _skip_name(s, i)
    i = _skip_whitespace_and_commas(s, i)
    if i < len(s) and s[i] == '(':
        i = _skip_balanced_delimiters(s, i, '(', ')')
    return i


def _skip_gql_type(s: str, i: int) -> int:
    i = _skip_whitespace_and_commas(s, i)
    if i < len(s) and s[i] == '[':
        i += 1
        i = _skip_gql_type(s, i)
        i = _skip_whitespace_and_commas(s, i)
        if i >= len(s) or s[i] != ']':
            raise GraphQLScanError('Unclosed list type')
        i += 1
        i = _skip_whitespace_and_commas(s, i)
        if i < len(s) and s[i] == '!':
            i += 1
        return i
    i = _skip_name(s, i)
    i = _skip_whitespace_and_commas(s, i)
    if i < len(s) and s[i] == '!':
        i += 1
    return i


def _skip_executable_operation(s: str, i: int, kw_len: int) -> int:
    i += kw_len
    i = _skip_whitespace_and_commas(s, i)
    if i < len(s) and _is_name_start(s[i]):
        i = _skip_name(s, i)
    i = _skip_whitespace_and_commas(s, i)
    if i < len(s) and s[i] == '(':
        i = _skip_balanced_delimiters(s, i, '(', ')')
    i = _skip_whitespace_and_commas(s, i)
    while i < len(s) and s[i] == '@':
        i = _skip_directive(s, i)
        i = _skip_whitespace_and_commas(s, i)
    if i >= len(s) or s[i] != '{':
        raise GraphQLScanError('Operation missing selection set')
    return _skip_braced_block(s, i)


def _skip_fragment_definition(s: str, i: int) -> int:
    i += len('fragment')
    i = _skip_whitespace_and_commas(s, i)
    i = _skip_name(s, i)
    i = _skip_whitespace_and_commas(s, i)
    if not _keyword_at(s, i, 'on'):
        raise GraphQLScanError('Invalid fragment definition')
    i += len('on')
    i = _skip_whitespace_and_commas(s, i)
    i = _skip_gql_type(s, i)
    i = _skip_whitespace_and_commas(s, i)
    while i < len(s) and s[i] == '@':
        i = _skip_directive(s, i)
        i = _skip_whitespace_and_commas(s, i)
    if i >= len(s) or s[i] != '{':
        raise GraphQLScanError('Fragment missing selection set')
    return _skip_braced_block(s, i)


def graphql_document_defines_mutation_or_subscription(query_text: str) -> bool:
    """
    True if the executable GraphQL document defines any mutation or subscription operation.

    Uses a small stdlib scanner (not a full GraphQL implementation): strips strings/comments,
    then walks top-level definitions so multi-operation documents cannot bypass via operationName.
    """
    prepared = _graphql_strip_comments_and_strings(query_text or '')
    i = 0
    n = len(prepared)
    while i < n:
        i = _skip_whitespace_and_commas(prepared, i)
        if i >= n:
            break
        if prepared[i] == '{':
            i = _skip_braced_block(prepared, i)
            continue
        if _keyword_at(prepared, i, 'query'):
            i = _skip_executable_operation(prepared, i, len('query'))
            continue
        if _keyword_at(prepared, i, 'mutation'):
            return True
        if _keyword_at(prepared, i, 'subscription'):
            return True
        if _keyword_at(prepared, i, 'fragment'):
            i = _skip_fragment_definition(prepared, i)
            continue
        raise GraphQLScanError('Unexpected token in GraphQL document')
    return False


def is_graphql_path(path):
    # Make sure this path has the following criteria:
    # The path must start with at least one path segment before a /graphql.
    # The /graphql segment must come before any query params.
    # Query params are optional.
    return re.match(r'^(\/[a-zA-Z0-9._~-]+)+\/graphql(\?.+)?$', path) is not None


def is_graphql_request(request):
    return is_graphql_path(request.get('rest_path')) and request.get('method').upper() == 'POST'


approved_post_paths = [
    '/v2/suggest/_signalflowsuggest2',
    '/v2/signalflow/_/getMetricTypes'
]


def is_approved_post_request(request):
    return request.get('method').upper() == 'POST' and request.get('rest_path') in approved_post_paths


def _graphql_query_body_is_valid(payload: dict) -> Tuple[Optional[str], Optional[str]]:
    """
    Return (query_string, None) if a non-empty query string is present, else (None, error_message).
    Missing, null, non-string, empty, and whitespace-only `query` are invalid.
    """
    if 'query' not in payload:
        return None, 'GraphQL query is required'
    raw = payload.get('query')
    if raw is None:
        return None, 'GraphQL query is required'
    if not isinstance(raw, str):
        return None, 'GraphQL query is required'
    if not raw.strip():
        return None, 'GraphQL query is required'
    return raw, None


def validate_request(request):
    if request.get('method') == 'GET' or is_approved_post_request(request):
        return
    if is_graphql_request(request):
        payload = json.loads(request.get('payload'))
        query_string, query_err = _graphql_query_body_is_valid(payload)
        if query_err:
            raise InvalidRequestMethodException(query_err)
        try:
            if graphql_document_defines_mutation_or_subscription(query_string):
                raise InvalidRequestMethodException(_GRAPHQL_DISALLOW_MSG)
        except GraphQLScanError as err:
            raise RequestValidationException(str(err)) from err
        return
    raise InvalidRequestMethodException()


def is_allowed_o11y_realm(realm):
    return re.fullmatch(O11Y_REALM_REGEX, realm) is not None
