#!/usr/bin/env python
# This work contains confidential material of Splunk Inc. Its use or disclosure in
#whole or in part without the express written permission of Splunk Inc. is prohibited.

import json
import os
import re
import random
import glob
import urllib
import sys
import splunk.Intersplunk
import splunk.clilib.cli_common as comm

from builtins import chr, range
from splunk.mining.DateParser import _validateDate, _validateTime
from splunk.clilib.bundle_paths import make_splunkhome_path


WORD_REGEX = re.compile(r'[^a-zA-Z0-9]+')
WORD_SPLIT = re.compile(r'([^a-zA-Z0-9]+)')

def _generateReplacement(term, nameterms):
    replacement = ""
    if looksLikeWord(term):
        # get list of names with the same length as the term
        names = nameterms.get(len(term), [])
        candidates = [n for n in names if n != term.lower()]
        if candidates:
            replacement = random.choice(candidates)
            names.remove(replacement)
            return replacement
        
    for ch in term:
        if ch.isdigit():
            # return a new number that is randomly less than the given value, so that ip addresses, and codes
            # are not higher than the value given.  otherwise we wil get ip addresses like 554.785.455.545.
            # this assumes that if given a number, a number lower than it will be equally valid
            maxVal = int(ch)
            newch = str(random.randint(0,maxVal))
        elif ch.isalpha():
            if ch.islower():
                newch = chr(random.randint(97,122))
            else:
                newch = chr(random.randint(65,90))
        else:
            newch = ch
        replacement += newch
    return replacement

def lengthLists(terms):
    result = dict()
    for key in terms.keys():
        addToMapList(result, len(key), key)
    return result


############################# DATEFINDER

def findAllDatesAndTimes(text, timeInfoTuplet):
    timeExpressions = timeInfoTuplet[0]
    dateExpressions = timeInfoTuplet[1]
    matches = getAllMatches(text, dateExpressions, _validateDate)
    matches.extend(getAllMatches(text, timeExpressions, _validateTime))
    return matches

def getAllMatches(text, patterns, validator):
    matches = list()
    for pat in patterns:
        for match in pat["regex"].finditer(text):
            values = match.groupdict()
            isvalid = validator(values)
            if isvalid:
                matches.append(match.span())
    return matches

# return true if position is between any start-end in list of regions
def inRegions(position, regions):
    for region in regions:
        start = region[0]
        end = region[1]
        if start <= position <= end:
            return True
    return False

def compilePatterns(raw_patterns):
    compiled_patterns = {
        "datePatterns": [],
        "timePatterns": []
    }
    for category in ["datePatterns", "timePatterns"]:
        for pat in raw_patterns[category]:
            compiled_patterns[category].append({
                "id": pat["id"],
                "regex": re.compile(pat["pattern"], re.I)
            })    
    return compiled_patterns

def getTimeInfoTuplet(timestampconfilename, err_collection):
    root = os.path.realpath(make_splunkhome_path(['etc', 'anonymizer']))
    if not os.path.isabs(root):
        root = os.path.abspath(root)

    timestampconfilename = os.path.realpath(os.path.normpath(timestampconfilename))
    if not os.path.isabs(timestampconfilename):
        timestampconfilename = os.path.abspath(timestampconfilename)

    if root != os.path.commonprefix([root, timestampconfilename]):
        print('*** File is not inside proper directory %s should be in %s'%(timestampconfilename, root))
        raise Exception('*** File is not inside proper directory %s should be in %s'%(timestampconfilename, root))

    raw_patterns = readPatterns(timestampconfilename, err_collection)

    if err_collection: 
        return None

    compiledPatterns = compilePatterns(raw_patterns)
    timeInfoTuplet = [compiledPatterns["timePatterns"], compiledPatterns["datePatterns"]]
    return timeInfoTuplet

############################# DATEFINDER
    
################################### BEGIN COPIED FROM DCUTILS.PY

def addToMapList(map, key, value):
    if key in map:
        l = map[key]
    else:
        l = list()
        map[key] = l
    safeAppend(l, value)
    return l
    

def fileWords(filename, lowercase):
    terms = dict()
    with open(filename) as f:
        count = 1
        while (True):
            line = f.readline()
            if (lowercase):
                line = line.lower()
            if len(line) == 0:
                break
            tokenize(line, False, terms)
            ##Is it possible to do previews from a search script?
            #if count % 100000 == 0:
            #    print('\t%u processed...' % count)
            count += 1
    return terms
        
def _check_json_depth(obj, max_depth=4, current_depth=0):
    """
    Recursively check JSON object depth with early exit for better security.
    Returns True if depth is within limits, False otherwise.
    """
    if current_depth > max_depth:
        return False
    
    if isinstance(obj, dict):
        for value in obj.values():
            if not _check_json_depth(value, max_depth, current_depth + 1):
                return False
    elif isinstance(obj, list):
        for item in obj:
            if not _check_json_depth(item, max_depth, current_depth + 1):
                return False
    
    return True


def readPatterns(filename, err_collection):
    
    # Security: Check file size before reading to prevent DoS attacks
    MAX_FILE_SIZE = 10 * 1024  # 10KB limit, while the default json file is 4KB
    MAX_NESTING_DEPTH = 4    # Maximum allowed JSON nesting depth: 4
    
    try:
        file_size = os.path.getsize(filename)
        if file_size > MAX_FILE_SIZE:
            message = f"Pattern file {filename} is too large ({file_size} bytes). Maximum allowed size is {MAX_FILE_SIZE} bytes."
            err_collection.append(message)
            return None
    except OSError as e:
        message = f"Unable to check size of pattern file {filename}: {str(e)}"
        err_collection.append(message)
        return None

    # The new format is JSON.
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
            
        # Security: Check nesting depth to prevent DoS attacks
        if not _check_json_depth(data, MAX_NESTING_DEPTH):
            message = f"Pattern file {filename} has nesting depth exceeding maximum allowed depth of {MAX_NESTING_DEPTH} levels."
            err_collection.append(message)
            return None
            
        return data
    except (json.JSONDecodeError, UnicodeDecodeError):
        # Not JSON. We assume it's Python, since it's the old format we supported.
        message = "The time-config " + filename + " is expected to be in JSON format."
        message += " Python format is no longer supported."
        message += " Use the new default config anonymizer-time.json as is or customize it."
        err_collection.append(message)

    return None


MAX_SEGMENT = 1024

def findBreak(start, segSize, text):
    segEnd = start + segSize - 1
    if segEnd > len(text):
        return len(text)-1
    for end in range(segEnd, max(start+1, segEnd-100), -1):
        if not text[end].isalnum():
            return end
    # failed to find break by going back 100 chars.  give up and break at will.
    return segEnd

# returns maps of terms and phrases to their count
def tokenize(text, wordsOnlyP, vector = dict()):
    segCount = int((len(text) + MAX_SEGMENT-1) / MAX_SEGMENT)
    segStart = 0

    for seg in range(0, segCount):
        segEnd = findBreak(segStart, MAX_SEGMENT, text)
        segText = text[segStart:segEnd+1]
        tokens = WORD_REGEX.split(segText)
        for token in tokens:
            if len(token) == 0:
                continue
            if not wordsOnlyP or looksLikeWord(token):
                incCount(vector, token, 1)
        segStart = segEnd+1
    return vector


def looksLikeWord(token):
    upper = lower = 0
    for c in token:
        if not c.isalpha():
            return False
        if c.isupper():
            upper += 1
        else:
            lower += 1
    return len(token) > 2 and (upper == 0 or lower == 0 or upper == 1)

def incCount(map, val, count):
    if val in map:
        map[val] += count
    else:
        map[val] = count


def safeAppend(list, val):
    if val not in list:
        list.append(val)

################################### END COPIED FROM DCUTILS.PY
        
def isInt(token):
    if len(token) > 0 and  token[0].isdigit():
        try:
            int(token)
            return True
        except:
            pass
    return False

def caseSame(caseSource, textSource):
    result = "";
    for i in range(0, len(caseSource)):
        casech = caseSource[i]
        textch = textSource[i]
        if casech.isupper():
            textch = textch.upper()
        elif casech.islower():
            textch = textch.lower()
        result += textch;
    return result;


def scrubValue(result, val, isRaw, allterms, replacements, publicTerms, privateTerms, nameTerms, timeInfoTuplet):

    regions = []
    if isRaw:
        regions = findAllDatesAndTimes(val, timeInfoTuplet)
    position = 0
    tokens = re.split(WORD_SPLIT, val)
    newtokens = list()
    for token in tokens:
        lower = token.lower()
        newtoken = token
        incCount(allterms, token, 1)
        inDateRegion = inRegions(position, regions) 
        # if term is name of not an attribute and not in a date region.
        # double check for numbers of public terms because date regions sometimes
        # have extraineous text if the regex matches contains a noise term or end of expression match            
        if (result.get(lower, None) == None) and not (inDateRegion and (isInt(token) or (lower in publicTerms and lower not in privateTerms))):
            # if we haven't already made a replacement for this term and it's a private term or not a public term
            if lower not in replacements and (lower in privateTerms or lower not in publicTerms): 
                replacements[lower] = newtoken = _generateReplacement(token, nameTerms) # make a replacement term
            newtoken = replacements.get(lower, token)
            newtoken = caseSame(token, newtoken)
        position += len(token)
        newtokens.append(newtoken)
    return ''.join(newtokens)

def scrub(results, publictermsfilename, privatefilename, nametermsfilename, dictionaryfilename, timeInfoTuplet):

    replacements = dict()
    privateTerms = fileWords(privatefilename, True)
    publicTerms = fileWords(dictionaryfilename, True)
    userpublicTerms = fileWords(publictermsfilename, True)
    nameTerms = lengthLists(fileWords(nametermsfilename, True))

    # add user public terms to default publicterms
    for t in userpublicTerms:
        publicTerms[t] = userpublicTerms[t]
    # add named entities to default publicterms

    protectedKeys = set(["eventtype", "linecount", "punct", "sourcetype", "timeendpos", "timestartpos"])

    allterms = dict()
    # for each result
    for r in results:
        # for each attribute
        for key,val in r.items():
            # only scrub attributes if doesn't start with '_' (except _raw) and if not a protected attribute and doesn't start with date_
            if (not key.startswith("_") or key == "_raw") and not key in protectedKeys and not key.startswith("date_"):
                r[key] = scrubValue(r, val, key=="_raw", allterms, replacements, publicTerms, privateTerms, nameTerms, timeInfoTuplet)

def locate_anonymize_file(filename, app_dir, err_collection):
  # paths aren't accepted
  path_qualifiers = (':', '/', '\\', '..')
  if any(i in filename for i in path_qualifiers):
    msg = ("Pathnames are not accepted for any of the filename arguments.  " +
           "The file specifier '%s' is not permitted.")
    err_collection.append(msg % filename)
    return None

  anonymize_dir = 'anonymizer'
  if app_dir:
    app_file_path = os.path.join(app_dir, anonymize_dir, filename)
    if os.path.isfile(app_file_path):
      return app_file_path

  global_file_path = make_splunkhome_path(['etc', anonymize_dir, filename])
  if os.path.isfile(global_file_path):
    return global_file_path

  # we couldn't find the file, so.. 
  msg = "The filename '%s' could not be found in the " % filename
  if app_dir:
    msg += "app or "
  msg += "the global directory.  Checked "
  if app_dir:
    msg += "'%s' and " % app_file_path
  msg += "'%s', but did not locate the file." % global_file_path
  err_collection.append(msg)
  return None

if __name__ == '__main__':
  try:    
    results,dummyresults,settings = splunk.Intersplunk.getOrganizedResults()
    argc = len(sys.argv)
    argv = sys.argv

    # if this is nonempty later, we'll write it out as error
    err_results = []

    # DEFAULT CONFIG FILE NAMES
    publictermsfilename     = "public-terms.txt"
    privatetermsfilename    = "private-terms.txt"
    nametermsfilename       = "names.txt"
    dictionaryfilename      = "dictionary.txt"
    timestampconfigfilename = 'anonymizer-time.json'

    # GET ARGS
    keywords, argvals = splunk.Intersplunk.getKeywordsAndOptions()

    # ALLOW ARGS TO OVERRIDE DEFAULTS
    publictermsfilename = argvals.get("public-terms", publictermsfilename)
    privatetermsfilename = argvals.get("private-terms", privatetermsfilename)
    nametermsfilename = argvals.get("name-terms", nametermsfilename)
    dictionaryfilename = argvals.get("dictionary", dictionaryfilename)
    timestampconfigfilename = argvals.get("time-config", timestampconfigfilename)

    # locate the files
    app = argvals.get("namespace")

    # first find the app, if it exists
    app_dir = None
    if app:
      if "/" in app or "\\" in app or ".." in app:
        msg = "Error: namespace name may not include the '/' '\\' or '..' sequences"
        err_results.append(msg)
      else:
        app_dir = make_splunkhome_path(['etc', 'apps', app])
        if not os.path.isdir(app_dir):
          app_dir = make_splunkhome_path(['etc', comm.getAppDir(), app])
          if not os.path.isdir(app_dir):
            msg = "Error: could not find specified app '%s' on disk" % app
            err_results.append(msg)
            app_dir = None

    # now find each file in either the app or the global dir
    publicterms_path = locate_anonymize_file(publictermsfilename, 
                                             app_dir, err_results)
    privateterms_path = locate_anonymize_file(privatetermsfilename, 
                                              app_dir, err_results)
    nameterms_path = locate_anonymize_file(nametermsfilename, 
                                           app_dir, err_results)
    dictionary_path = locate_anonymize_file(dictionaryfilename, 
                                            app_dir, err_results)
    timestampconfig_path = locate_anonymize_file(timestampconfigfilename, 
                                                 app_dir, err_results)
    timeInfoTuplet = getTimeInfoTuplet(timestampconfig_path, err_results)
    
    if not err_results:
      scrub(results, publicterms_path, privateterms_path, 
            nameterms_path, dictionary_path, timeInfoTuplet)
              
  except:
    import traceback
    stack =  traceback.format_exc()
    results = splunk.Intersplunk.generateErrorResults("Error : Traceback: " + str(stack))
    err_results=[]

# pass back explicitly determined errors
if err_results:
  # The call doesn't return the generated error results; it emits err_results and returns None.
  results = splunk.Intersplunk.generateErrorResults("\n".join(err_results))

splunk.Intersplunk.outputResults( results )
