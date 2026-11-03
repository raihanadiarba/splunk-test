/**
 * @file
 * C API for standalone Splunk field extraction.
 */

#ifndef SPLUNK_EXTRACT_API_H
#define SPLUNK_EXTRACT_API_H

#include <stddef.h>

#ifdef __cplusplus
extern "C" {
#endif

#define SPLUNK_EXTRACT_API __attribute__((visibility("default")))

typedef struct splunk_extractor* splunk_extractor_t;
typedef struct splunk_result splunk_result_t;
typedef struct splunk_inference_details splunk_inference_details_t;

/**
 * @brief    A non-owning string view returned by the result API.
 *
 * Memory is owned by the parent splunk_result_t and remains valid until
 * splunk_result_destroy() is called.
 */
typedef struct splunk_string_view {
    const char* ptr;
    size_t len;
} splunk_string_view_t;

/**
 * @brief    Field metadata for result field APIs.
 */
typedef struct splunk_result_field_info {
    splunk_string_view_t key;
    splunk_string_view_t value;
    size_t mv_index;     ///< 0-based index within a multivalue field
    unsigned int flags;  ///< Bitmask of SPLUNK_RESULT_FIELD_FLAG_* values
} splunk_result_field_info_t;

/**
 * @brief    Candidate metadata entry for inference-details APIs.
 */
typedef struct splunk_inference_candidate_info {
    splunk_string_view_t sourcetype;
    double score;
    int matched_requested_fields;
    int non_meta_field_count;
    int extracted;
} splunk_inference_candidate_info_t;

/**
 * @brief    Inference outcome for inference APIs.
 */
typedef enum splunk_inference_status {
    SPLUNK_INFERENCE_STATUS_EXTRACTED = 0,
    SPLUNK_INFERENCE_STATUS_AMBIGUOUS = 1,
    SPLUNK_INFERENCE_STATUS_NO_MATCH = 2,
    SPLUNK_INFERENCE_STATUS_INVALID_INPUT = 3
} splunk_inference_status_t;

/**
 * @brief    Inference tuning options for inference APIs.
 */
typedef struct splunk_inference_options {
    int enable_discovery;  ///< 1 enables discovery when candidates is empty
    int max_candidates_to_evaluate;  ///< <=0 evaluates all provided candidates
    double min_confidence;           ///< [0,1], <=0 disables threshold
    double ambiguity_margin;         ///< [0,1], default ~0.15 recommended
} splunk_inference_options_t;

/**
 * @brief    Create-time extraction stage options.
 *
 * Pass NULL to create APIs to preserve current behavior: SEDCMD, eventtypes,
 * and tags run when enabled stanzas are present. Pass a non-NULL options
 * struct to explicitly gate those stages for the extractor instance.
 */
typedef struct splunk_extractor_stage_options {
    int enable_sedcmd;      ///< Non-zero enables SEDCMD processing
    int enable_eventtypes;  ///< Non-zero enables eventtype processing
    int enable_tags;        ///< Non-zero enables tag processing
} splunk_extractor_stage_options_t;

/**
 * @brief    Per-item status for batch extraction APIs.
 */
typedef enum splunk_batch_item_status {
    SPLUNK_BATCH_ITEM_STATUS_EXTRACTED = 0,
    /** Internal initialization sentinel; not returned for a completed item. */
    SPLUNK_BATCH_ITEM_STATUS_INIT = 1,
    SPLUNK_BATCH_ITEM_STATUS_INVALID_INPUT = 2,
    SPLUNK_BATCH_ITEM_STATUS_ERROR = 3
} splunk_batch_item_status_t;

/**
 * @brief    Field flag: this entry came from a multivalue field.
 */
#define SPLUNK_RESULT_FIELD_FLAG_MULTIVALUE 0x1u

#ifdef __cplusplus
#define SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS = nullptr
#else
#define SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS
#endif

/**
 * @brief    Create an extractor instance from a TA root directory.
 *
 * @param    ta_root   Absolute path to the TA root directory containing
 *                     default/props.conf, default/transforms.conf, etc.
 * @param    options   Optional create-time stage options (NULL = current
 *                     default behavior)
 * @return   Opaque handle, or NULL on failure.
 */
SPLUNK_EXTRACT_API splunk_extractor_t splunk_extractor_create_from_ta_root(
        const char* ta_root, const splunk_extractor_stage_options_t* options
                                     SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS);

/**
 * @brief    Create an extractor from a canonical Splunk conf root.
 *
 * @param    conf_root   Absolute path to root containing canonical layout:
 *                       - system/default (required)
 *                       - system/local (optional)
 *                       - system/default/conf.conf (optional; if present, the
 *                         caller's file is used as-is; if absent, the library
 *                         installs its built-in minimal extraction bootstrap
 *                         in private staging)
 *                       - apps/<app>/default and/or apps/<app>/local
 *                       - apps/<app>/lookups and apps/<app>/metadata (optional)
 *                       - users/<user>/<app>/local (optional, for user context)
 * @param    app         App context (defaults to "search" if empty)
 * @param    user        User context (defaults to "nobody" if empty).
 *                       When a real user is given, conf files under
 *                       users/<user>/<app>/local/ in conf_root are staged into
 *                       the extractor's private staging tree under the same
 *                       users/<user>/<app>/local/ path, so user-local settings
 *                       take effect through the standard user-local conf layer.
 * @param    options     Optional create-time stage options (NULL = current
 *                       default behavior)
 *
 * @note     Isolation is achieved through per-extractor private staging.
 *           system/default/ is always copied so the staged bootstrap remains
 *           private; system/local/, system/lookups/, apps/, and users/<user>/
 *           are symlinked for efficiency. Two extractors may safely share the
 *           same conf_root path, including concurrent use.
 *
 * @note     Production services should avoid passing a live mutable
 *           system/ tree directly. Prefer a pinned/managed baseline plus
 *           explicit app roots to reduce environment drift.
 *
 * @note     A caller-provided system/default/conf.conf is used without adding,
 *           removing, or reordering providers. The caller is responsible for a
 *           complete bootstrap suitable for its bundle. If the file is absent,
 *           the library installs its built-in minimal extraction bootstrap in
 *           the private staging tree. The built-in bootstrap registers conf,
 *           CSV lookup, and app metadata providers only; it does not register
 *           search scripts or write routes.
 */
SPLUNK_EXTRACT_API splunk_extractor_t splunk_extractor_create_from_conf_root(
        const char* conf_root, const char* app, const char* user,
        const splunk_extractor_stage_options_t* options
                SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS);

/**
 * @brief    Create an extractor from discrete system/apps roots.
 *
 * @param    system_root Absolute path to system root (contains default/local).
 *                       Pass NULL or empty to use managed default baseline.
 * @param    enabled_app_roots
 *                       Array of app-root paths. Each path points to one app
 *                       directory that contains default/ and/or local/.
 *                       Paths must be absolute and do not need to be relative
 *                       to system_root or to each other.
 * @param    app_root_count
 *                       Number of entries in enabled_app_roots.
 * @param    app         App context (defaults to "search" if empty)
 * @param    user        User context (defaults to "nobody" if empty)
 * @param    options     Optional create-time stage options (NULL = current
 *                       default behavior)
 *
 * @note     Recommended service pattern:
 *           - use a pinned/minimal `system_root` baseline controlled by the
 *             library/deployment
 *           - pass only explicitly enabled app roots in enabled_app_roots
 *
 * @note     For a non-empty system_root, an existing default/conf.conf is used
 *           as-is, without provider changes. The caller is responsible for a
 *           complete bootstrap suitable for the supplied app roots. If the
 *           file is absent, the library installs its built-in minimal
 *           extraction bootstrap in the private staging tree.
 *
 * @note     Avoid wiring this directly to a host's full live system conf for
 *           normal execution; do that only for parity/debug workflows.
 */
SPLUNK_EXTRACT_API splunk_extractor_t
splunk_extractor_create_from_system_and_apps(
        const char* system_root, const char* const* enabled_app_roots,
        int app_root_count, const char* app, const char* user,
        const splunk_extractor_stage_options_t* options
                SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS);

/**
 * @brief    Create an extractor from enabled apps using managed system defaults.
 *
 * Equivalent to splunk_extractor_create_from_system_and_apps(NULL, ...).
 */
SPLUNK_EXTRACT_API splunk_extractor_t splunk_extractor_create_from_enabled_apps(
        const char* const* enabled_app_roots, int app_root_count,
        const char* app, const char* user,
        const splunk_extractor_stage_options_t* options
                SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS);

#undef SPLUNK_EXTRACT_DEFAULT_STAGE_OPTIONS

/**
 * @brief    Destroy an extractor instance.
 */
SPLUNK_EXTRACT_API void splunk_extractor_destroy(splunk_extractor_t ext);

/**
 * @brief    Return the thread-local error from the last create/init failure.
 *
 * Returns NULL if no create error is available for this thread.
 */
SPLUNK_EXTRACT_API const char* splunk_extractor_get_last_create_error(void);

/**
 * @brief    Set native logger level for extraction runtime categories.
 *
 * @param    level  Log level string (e.g. "DEBUG", "INFO", "WARN", "ERROR").
 * @return   0 on success, -1 on invalid level.
 *
 * @note     This applies the requested level to currently-known runtime
 *           channels and pre-seeds key extraction categories.
 */
SPLUNK_EXTRACT_API int splunk_extract_set_log_level(const char* level);

/**
 * @brief    Set native logger level for one category/channel.
 *
 * @param    category  Channel name (for example "FastTyper").
 * @param    level     Log level string (e.g. "DEBUG", "INFO", "WARN", "ERROR").
 * @return   0 on success, -1 on invalid input or invalid level.
 */
SPLUNK_EXTRACT_API int splunk_extract_set_log_category_level(
        const char* category, const char* level);

/**
 * @brief    Extract fields from a raw event.
 *
 * @param    ext              Extractor handle
 * @param    app              App context (required; e.g. "search")
 * @param    user             User context (nullable)
 * @param    raw_event        Raw event text
 * @param    raw_len          Length of raw event
 * @param    sourcetype       Sourcetype string
 * @param    source           Source string (may be NULL)
 * @param    host             Host string (may be NULL)
 * @param    requested_fields Array of field names to extract (NULL = all)
 * @param    field_count      Number of requested fields
 * @return   Result handle, or NULL on failure.
 *
 * @note     For KV_MODE=multi sourcetypes, this function returns fields for
 *           the first parsed row only (plus metadata such as _mkv_rowcount).
 *           Use splunk_extract_multi_result() for full row parity.
 *
 * @note     Thread safety: Calls that resolve to the same engine key
 *           (sourcetype + app + user + normalized requested-field set)
 *           are serialized internally. Calls on different engine keys
 *           can execute concurrently.
 */
SPLUNK_EXTRACT_API splunk_result_t* splunk_extract(
        splunk_extractor_t ext, const char* app, const char* user,
        const char* raw_event, size_t raw_len, const char* sourcetype,
        const char* source, const char* host, const char** requested_fields,
        int field_count);

/**
 * @brief    Batch extraction with per-item status outputs.
 *
 * Executes extraction for a list of events and returns one result handle per
 * input event in the same order. Individual items may be NULL (for example,
 * for an invalid input row or item-level preparation/result error). An
 * exception escaping a native processor is a batch-level failure, matching
 * native Search pipeline termination semantics.
 *
 * @param    ext              Extractor handle
 * @param    app              App context (required)
 * @param    user             User context (nullable)
 * @param    raw_events       Array of raw event strings
 * @param    raw_lens         Array of raw-event lengths
 * @param    sourcetypes      Array of sourcetype strings
 * @param    sources          Array of source strings (nullable array and/or items)
 * @param    hosts            Array of host strings (nullable array and/or items)
 * @param    event_count      Number of input events
 * @param    requested_fields Array of requested fields (nullable = all)
 * @param    field_count      Number of requested fields
 * @param[out] out_items      Output result-pointer array; `(*out_items)[i]`
 *                            corresponds to raw_events[i]
 * @param[out] out_count      Output number of result handles (equals event_count)
 * @param[out] out_statuses   Output status array; `(*out_statuses)[i]`
 *                            corresponds to raw_events[i]
 *
 * @return   0 on success, including when individual items report errors. A
 *           non-empty success returns the output arrays; an empty batch with
 *           otherwise valid arguments returns success with the arrays NULL
 *           and `*out_count` zero. Returns -1 on batch-level failure, with
 *           `*out_items` and `*out_statuses` NULL and `*out_count` zero.
 * Caller owns row handles and must destroy via splunk_result_list_destroy().
 * The result and status arrays are independent allocations; release the status
 * array separately with splunk_free_int_list().
 *
 * @note     Each item has the same first-row semantics as splunk_extract().
 *           The implementation may process bounded, homogeneous chunks in a
 *           native multi-row pass. Events whose effective post-SEDCMD and
 *           TRANSFORMS props key enables KV_MODE=multi are classified before
 *           native batch work and use scalar first-row extraction directly.
 *           A native chunk is never retried through the scalar path.
 *
 * @note     Native prepared-input staging is bounded to 256 events or 8 MiB
 *           of effective raw data after the SEDCMD and TRANSFORMS prepasses per
 *           homogeneous chunk, whichever is reached first. One input larger
 *           than 8 MiB after both prepasses is processed as an oversized
 *           singleton.
 *           These are chunk-admission limits, not a native-scratch or
 *           total-memory byte cap. Metadata, processor outputs, returned
 *           results, caller-owned arrays, engine/config caches, and an
 *           oversized singleton consume additional memory.
 *
 * @note     Invalid event rows (a null raw pointer or null/empty sourcetype)
 *           are reported independently; invalid batch-level arguments return
 *           -1. Recoverable event-data problems handled internally by native
 *           processors do not interrupt the call, so remaining events and
 *           chunks continue normally. Any exception escaping batch planning or
 *           engine execution stops processing and returns -1 with no output
 *           arrays. For an escaping native processor exception, this follows
 *           native Search termination semantics. A failed native chunk is not
 *           retried through scalar extraction. The extractor last-error string
 *           is shared diagnostic state and is not a per-item error channel,
 *           especially during concurrent calls. When an exception escapes an
 *           executing native chunk or scalar MultiKV item, an error log on the
 *           SplunkExtractApi channel records its inclusive global input range.
 */
SPLUNK_EXTRACT_API int splunk_extract_batch_result_with_status(
        splunk_extractor_t ext, const char* app, const char* user,
        const char** raw_events, const size_t* raw_lens,
        const char** sourcetypes, const char** sources, const char** hosts,
        int event_count, const char** requested_fields, int field_count,
        splunk_result_t*** const out_items, int* const out_count,
        int** const out_statuses);

/**
 * @brief    Get number of extracted field entries in a result.
 *
 * Multi-value fields contribute one entry per value.
 */
SPLUNK_EXTRACT_API size_t
splunk_result_field_count(const splunk_result_t* result);

/**
 * @brief    Get all field entries at once for bulk reading.
 *
 * Writes field info into a caller-provided array of splunk_result_field_info_t.
 * The caller must allocate an array of at least splunk_result_field_count()
 * entries. This avoids per-field function call overhead.
 *
 * @param    result  Result handle
 * @param[out] out   Caller-allocated array of field info structs
 * @param    count   Size of the out array
 * @return   Number of fields written, or 0 on invalid args.
 *
 * @note     Returned string views are invalidated by splunk_result_destroy().
 */
SPLUNK_EXTRACT_API size_t
splunk_result_get_fields_bulk(const splunk_result_t* result,
                              splunk_result_field_info_t* out, size_t count);

/**
 * @brief    Destroy a result returned by splunk_extract().
 */
SPLUNK_EXTRACT_API void splunk_result_destroy(splunk_result_t* result);

/**
 * @brief    Extract multi-row results as native result handles.
 *
 * Each row is returned as one splunk_result_t* in out_items.
 * Caller owns result handles and must eventually destroy each one with
 * splunk_result_destroy() or collectively with splunk_result_list_destroy().
 *
 * @param[out] out_items Output array of result handles
 * @param[out] out_count Number of result handles
 * @return   0 on success, -1 on failure.
 */
SPLUNK_EXTRACT_API int splunk_extract_multi_result(
        splunk_extractor_t ext, const char* app, const char* user,
        const char* raw_event, size_t raw_len, const char* sourcetype,
        const char* source, const char* host, const char** requested_fields,
        int field_count, splunk_result_t*** const out_items,
        int* const out_count);

/**
 * @brief    Destroy a list returned by splunk_extract_multi_result() or
 *           splunk_extract_batch_result_with_status().
 *
 * Destroys each result handle in the list and then frees the list container.
 * Safe for lists that contain NULL entries.
 */
SPLUNK_EXTRACT_API void splunk_result_list_destroy(splunk_result_t** items,
                                                   size_t count);

/**
 * @brief    Free only the list container returned by splunk_extract_multi_result()
 *           or splunk_extract_batch_result_with_status().
 *
 * Use this when ownership of individual result handles has been transferred.
 */
SPLUNK_EXTRACT_API void splunk_result_list_free(splunk_result_t** items);

/**
 * @brief    Free an int list returned by splunk_extract_batch_result_with_status().
 */
SPLUNK_EXTRACT_API void splunk_free_int_list(int* items);

/**
 * @brief    Free a double list returned by batch inference APIs.
 */
SPLUNK_EXTRACT_API void splunk_free_double_list(double* items);

/**
 * @brief    Get extractable fields as a string list.
 *
 * @param[out] out_items Output array of field-name strings (allocated)
 * @param[out] out_count Output number of field names
 * @return   0 on success, -1 on error.
 */
SPLUNK_EXTRACT_API int splunk_get_extractable_fields_list(
        splunk_extractor_t ext, const char* app, const char* user,
        const char* sourcetype, char*** const out_items, int* const out_count);

/**
 * @brief    Free a string allocated by the extraction library.
 */
SPLUNK_EXTRACT_API void splunk_free(char* ptr);

/**
 * @brief    Free a string list returned by splunk_get_extractable_fields_list().
 */
SPLUNK_EXTRACT_API void splunk_free_string_list(char** items, size_t count);

/**
 * @brief    Check if KV_MODE=multi is enabled for a sourcetype.
 *
 * @param    ext         Extractor handle
 * @param    sourcetype  Sourcetype string
 * @return   1 if KV_MODE=multi, 0 otherwise; -1 on error.
 */
SPLUNK_EXTRACT_API int splunk_is_multikv(splunk_extractor_t ext,
                                         const char* app, const char* user,
                                         const char* sourcetype);

/**
 * @brief    Inference API with ranked candidate metadata.
 *
 * Returns an owned inference-details object that includes status, confidence,
 * chosen sourcetype, optional extracted result, and per-candidate metrics.
 */
SPLUNK_EXTRACT_API splunk_inference_details_t*
splunk_extract_with_inference_details(
        splunk_extractor_t ext, const char* app, const char* user,
        const char* raw_event, size_t raw_len, const char* source,
        const char* host, const char** candidates, int candidate_count,
        const char** requested_fields, int field_count,
        const splunk_inference_options_t* options);

/**
 * @brief    Read status from inference details.
 */
SPLUNK_EXTRACT_API splunk_inference_status_t
splunk_inference_details_status(const splunk_inference_details_t* details);

/**
 * @brief    Read confidence from inference details.
 */
SPLUNK_EXTRACT_API double splunk_inference_details_confidence(
        const splunk_inference_details_t* details);

/**
 * @brief    Get chosen sourcetype view from inference details.
 *
 * @param[out] out   Chosen sourcetype view
 * @return   0 on success, -1 if unavailable.
 */
SPLUNK_EXTRACT_API int splunk_inference_details_get_chosen_sourcetype(
        const splunk_inference_details_t* details, splunk_string_view_t* out);

/**
 * @brief    Get number of candidate metadata entries.
 */
SPLUNK_EXTRACT_API size_t splunk_inference_details_candidate_count(
        const splunk_inference_details_t* details);

/**
 * @brief    Read candidate metadata by index.
 *
 * @param[out] out   Candidate metadata
 * @return   0 on success, -1 on invalid args/out-of-range.
 */
SPLUNK_EXTRACT_API int splunk_inference_details_get_candidate(
        const splunk_inference_details_t* details, size_t index,
        splunk_inference_candidate_info_t* out);

/**
 * @brief    Transfer ownership of extracted result from inference details.
 *
 * Returns NULL if there is no extracted result.
 */
SPLUNK_EXTRACT_API splunk_result_t* splunk_inference_details_take_result(
        splunk_inference_details_t* details);

/**
 * @brief    Destroy inference details object.
 */
SPLUNK_EXTRACT_API void splunk_inference_details_destroy(
        splunk_inference_details_t* details);

/**
 * @brief    Multi-row extraction with optional candidate inference/discovery.
 *
 * Uses the same sourcetype-selection behavior as
 * splunk_extract_with_inference_details():
 * ordered deterministic candidate mode and ambiguity-aware discovery mode.
 *
 * @param[out] out_items           Output array of row result handles
 * @param[out] out_count           Output number of row result handles
 * @param[out] out_chosen_sourcetype Output chosen sourcetype (malloc'd, nullable)
 * @param[out] out_confidence      Output confidence [0,1] (nullable)
 * @param[out] out_status          Output status (nullable)
 *
 * @return   0 on handled call; -1 on invalid out-arg contract or internal failure.
 *           When status is not EXTRACTED, out_items remains NULL and out_count is 0.
 *           Caller owns row handles and must destroy via splunk_result_list_destroy().
 */
SPLUNK_EXTRACT_API int splunk_extract_multi_with_inference_result(
        splunk_extractor_t ext, const char* app, const char* user,
        const char* raw_event, size_t raw_len, const char* source,
        const char* host, const char** candidates, int candidate_count,
        const char** requested_fields, int field_count,
        const splunk_inference_options_t* options,
        char** const out_chosen_sourcetype, double* const out_confidence,
        splunk_inference_status_t* const out_status,
        splunk_result_t*** const out_items, int* const out_count);

/**
 * @brief    Batch single-result inference with per-event candidates/options.
 *
 * Evaluates each input event independently using
 * splunk_extract_with_inference_details().
 * Input/output ordering is preserved.
 *
 * @param    candidate_lists      Array of per-event candidate arrays (nullable)
 * @param    candidate_counts     Array of per-event candidate counts (nullable)
 * @param    options_list         Array of per-event inference options (nullable)
 * @param[out] out_items          Output array of result handles
 * @param[out] out_count          Output number of result handles
 * @param[out] out_statuses         Output array of SPLUNK_INFERENCE_STATUS_* values
 * @param[out] out_confidences      Output array of confidence values
 * @param[out] out_chosen_sourcetypes Output array of chosen sourcetype strings
 *
 * @return   0 on success, -1 on batch-level argument/allocation failure.
 */
SPLUNK_EXTRACT_API int splunk_extract_batch_with_inference_result(
        splunk_extractor_t ext, const char* app, const char* user,
        const char** raw_events, const size_t* raw_lens, const char** sources,
        const char** hosts, const char*** candidate_lists,
        const int* candidate_counts,
        const splunk_inference_options_t* options_list, int event_count,
        const char** requested_fields, int field_count,
        splunk_result_t*** const out_items, int* const out_count,
        int** const out_statuses, double** const out_confidences,
        char*** const out_chosen_sourcetypes);

/**
 * @brief    Get the last error message.
 *
 * @param    ext  Extractor handle
 * @return   Error message string, or NULL if no error. Do NOT free this string.
 */
SPLUNK_EXTRACT_API const char* splunk_extractor_get_last_error(
        splunk_extractor_t ext);

#ifdef __cplusplus
}
#endif

#endif  // SPLUNK_EXTRACT_API_H
