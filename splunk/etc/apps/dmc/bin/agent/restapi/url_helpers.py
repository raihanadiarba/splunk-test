# pylint: disable=missing-docstring
# pylint: disable=invalid-name
# pylint: disable=no-init
# pylint: disable=no-self-use
# pylint: disable=attribute-defined-outside-init
# pylint: disable=too-few-public-methods


def decode(config):
    ''' Decode a path segment that might contain an URL encoded "/" '''
    assert not config
    regexp = r'[^/]+'

    def to_python(match):
        # SPL-121580
        # CherryPy server ensure that encoded "/" is represented by "%2F".
        return match.replace("%2F", "/")

    def to_url(segment):
        return segment.replace("/", "%2F")

    return regexp, to_python, to_url
