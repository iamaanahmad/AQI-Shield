# Frontend integration boundary

The current UI is an explicit sample preview. It makes no air-data, Bedrock or cloud-history calls. Local history contains only city identifiers and fictional sample IDs. All city previews intentionally use the same scenario, not measured city conditions.

Replace `frontend/lib/data.ts` fixtures with a typed service adapter in the backend phase. Keep source, observation timestamp, provider index name/range, forecast timestamps, unit, and sample/live status mandatory. Never label OpenWeather 1–5 as CPCB 0–500. Recheck air-provider rights and retention before selecting a provider.

Expected routes: POST /session, POST /advisory, POST /alerts, GET /alerts, DELETE /alerts/{id}. An advisory response should include both English and Hindi explanations so toggling language needs no model call. Send city coordinates to the backend only when connected and disclosed. Current browser geolocation only selects a listed city within 80 km; coordinates never leave the browser.

Use server-generated random session tokens with hashed owner partitions for DynamoDB. Never accept client-supplied partition keys. TTL is 30 days; limit list size and validate all inputs. Set explicit origins, throttle API usage, and limit model output.

The backend must validate data timestamps and model structure. Stale or missing data must suppress the lower-exposure window. Compute the window from consecutive forecast hours before asking the model to explain it. Never promise safe air. Include source-specific attribution and clear model/fallback status. Missing backend configuration must never quietly display samples as live readings.
