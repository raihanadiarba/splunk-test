# zzz_cloud_build_defaults

## Purpose

This app provides a mechanism for setting **global, cloud-specific configuration defaults** that apply across all customers and all node types in a Splunk Cloud deployment. Because Splunk resolves configuration precedence alphabetically by app name, the `zzz_` prefix ensures these settings are loaded last among apps, giving them the lowest precedence and allowing any higher-priority context (such as user or app overrides) to take effect above them.

Settings in this app are delivered at build time as part of the Splunk Cloud image and serve as the authoritative baseline for cloud-only configuration values that should not be present in non-cloud builds.

---

## Critical: Do NOT Mix zzz App Defaults with Puppet Overrides

**You must not set a value in this app's `default/` directory and then attempt to override it from a different app via Puppet (e.g., `100-whisper` or any other app).**

Splunk's configuration merging is precedence-based, not last-write-wins. The final effective value for a setting is determined by the app with the highest precedence in the merge stack, not by which config was written most recently. The `zzz_` prefix gives this app the *lowest* precedence among all apps — meaning any setting placed here is intentionally designed to be overridable by higher-priority apps.

If you set a value here and Puppet writes the same setting into a different, higher-precedence app (e.g., `100-whisper`), the Puppet-managed value will win — but the zzz app value will still exist and may cause confusion, unexpected behavior during upgrades, or conflicts if precedence ordering ever changes.

### The correct pattern if Puppet must manage the setting

If a setting must be managed by Puppet, **Puppet must write it into this same app** (`zzz_cloud_build_defaults`), not into a separate app. Specifically:

- Puppet should update `etc/apps/zzz_cloud_build_defaults/default/<conf_file>.conf` (or `local/` for local overrides)
- Do **not** have Puppet write the same setting into a different app (e.g., `100-whisper`) while this app also defines it

This keeps the source of truth for each setting in one place and prevents silent conflicts from split ownership.

---

## Reading Settings via the API

When reading configuration values programmatically, always use the merged namespace endpoints rather than app-specific ones:

**Preferred:**
```
GET /servicesNS/nobody/-/<conf_endpoint>
GET /servicesNS/-/-/<conf_endpoint>
```

These endpoints return the fully merged, effective configuration value across all apps and contexts, reflecting Splunk's actual precedence resolution. This is the value Splunk will use at runtime.

**Avoid:**
```
GET /services/<conf_endpoint>
GET /servicesNS/nobody/search/<conf_endpoint>
GET /servicesNS/nobody/100-whisper/<conf_endpoint>
```

- `/services/` resolves in the context of the calling user's default app (typically `search`), which will not reflect the merged global value.
- App-specific namespace reads (any app other than `zzz_cloud_build_defaults` itself) return only the value as seen within that app's context, which may not reflect the final effective value after all apps have been merged.

Reading from the zzz app namespace directly is acceptable if you specifically need to inspect what this app contributes, but for the authoritative runtime value, always use the `-` (wildcard) app namespace shown above.
