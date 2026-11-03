import hashlib
import json


SIGNALFLOW_LOG_PREVIEW_LENGTH = 512
LOG_VALUE_DELIMITER_ENCODINGS = {
    '%': '%25',
    '=': '%3D',
    ',': '%2C'
}


def signalflow_log_summary(program):
    """Return a one-line, bounded representation that is safe for Splunk logs."""
    text = '' if program is None else str(program)
    digest = hashlib.sha256(text.encode('utf-8', errors='replace')).hexdigest()
    preview = sanitize_log_value(text)
    return 'len={0}, sha256={1}, preview={2}'.format(
        len(text),
        digest,
        json.dumps(preview)
    )


def sanitize_signalflow_for_log(program, max_length=SIGNALFLOW_LOG_PREVIEW_LENGTH):
    return sanitize_log_value(program, max_length)


def sanitize_log_value(value, max_length=SIGNALFLOW_LOG_PREVIEW_LENGTH):
    """Return a bounded value that cannot add log lines or key/value fields."""
    text = '' if value is None else str(value)
    sanitized_chars = []
    previous_space = False

    for char in text:
        replacement = ' ' if _is_control_char(char) or char.isspace() else char
        if replacement == ' ':
            if not previous_space:
                sanitized_chars.append(replacement)
                previous_space = True
        else:
            sanitized_chars.append(replacement)
            previous_space = False

    return _encode_log_delimiters(''.join(sanitized_chars).strip(), max_length)


def _encode_log_delimiters(value, max_length):
    encoded_chars = []
    encoded_length = 0
    truncated = False

    for char in value:
        replacement = LOG_VALUE_DELIMITER_ENCODINGS.get(char, char)
        if encoded_length + len(replacement) > max_length:
            truncated = True
            break
        encoded_chars.append(replacement)
        encoded_length += len(replacement)

    encoded_value = ''.join(encoded_chars)
    if truncated:
        encoded_value += '...'
    return encoded_value


def _is_control_char(char):
    codepoint = ord(char)
    return codepoint < 32 or 0x7F <= codepoint <= 0x9F
