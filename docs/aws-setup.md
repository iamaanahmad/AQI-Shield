# AWS setup planning

Deployment remains deferred. These are preparation notes, not deployed infrastructure.

## AWS setup runbook for the later backend phase

No commands below were run. Resource names and model settings are planned parameters.

1. Confirm the founder has resumed backend deployment. This implementation began before the event and is not an eligible entry.
2. Select an AWS account and region. Check available credits and permitted spend before creating resources.
3. Install AWS CLI v2, SAM CLI, Python 3.12, supported Node.js, and Docker for container builds.
4. Authenticate through a short-lived profile. Check the account using `aws sts get-caller-identity --profile aqi-shield`.
5. In Bedrock, select a Claude model supporting Converse in the intended region.
6. Complete Anthropic's first-use details if required. Verify Marketplace prerequisites and model availability.
7. Set the model or inference-profile identifier as a deployment parameter. Do not assume Mumbai supports every model.
8. Keep Marketplace permissions on the setup identity. The runtime role gets scoped inference permission only.
9. Obtain provider access after confirming its terms. Store the key in encrypted parameter storage; never commit it.
10. In the backend phase, implement `infrastructure/template.yaml` with Python Lambda, HTTP API, and DynamoDB.
11. Set DynamoDB billing to PAY_PER_REQUEST, TTL, and encryption. Add only required item and query permissions.
12. Limit `bedrock:InvokeModel` to the chosen model or inference profile and its required destination model resources.
13. Limit secret reads to the provider parameter. Limit logs to this app's log groups, with short retention.
14. Set Lambda timeout, memory, reserved concurrency, API throttles, and a bounded daily inference allowance.
15. Configure exact allowed frontend origins. CORS alone is not authentication or abuse protection.
16. Run `sam validate --lint --template-file infrastructure/template.yaml` and the Python tests.
17. Run `sam build --use-container --template-file infrastructure/template.yaml`.
18. Run `sam deploy --guided --profile aqi-shield` only in the approved backend phase.
19. Use stack name `aqi-shield-dev`. Review IAM changes and CloudFormation changes before confirming deployment.
20. Record the API output URL. Test current data, fallback, language, save, history, and cross-session isolation.
21. In Amplify, choose New app, GitHub, `iamaanahmad/AQI-Shield`, and the checked branch.
22. Set the app root to `frontend`. Use its lockfile, `npm ci`, and `npm run build`.
23. Prefer static export for this client-driven interface. Publish `out`; test direct Home, Result, and History navigation.
24. Set only public API configuration in `NEXT_PUBLIC_API_BASE_URL`. Never expose the provider key.
25. Deploy, then set the exact Amplify HTTPS origin in API CORS and redeploy that configuration.
26. Test the public URL signed out, on mobile, and after refresh. Verify the actual backend result, not screenshots alone.
27. Record requests, model usage, elapsed times, and costs. Redact secrets, coordinates, and session tokens from evidence.

Sources: [SAM deployment](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/using-sam-cli-deploy.html),
[Amplify support](https://docs.aws.amazon.com/amplify/latest/userguide/ssr-amplify-support.html),
[Bedrock model access](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html).

Use request-driven compute with no provisioned concurrency, NAT gateway, or scheduled refresh in the MVP.
"Scales to zero" describes idle compute, not a guarantee of zero total charges.
Storage, hosting, logs, requests, and Bedrock can incur costs. Credits and budgets are not hard spending caps.
Enforce an application inference limit before Bedrock calls. Stop rather than silently exceed the authorized allowance.
Source: [DynamoDB pricing](https://aws.amazon.com/dynamodb/pricing/).

## Under-three-minute demo plan

Target 2 minutes 45 seconds, leaving encoding and editing margin.

| Time | Show | Evidence |
|---|---|---|
| 0:00–0:20 | A parent's school-trip decision | Explain the problem without fabricated users or outcomes |
| 0:20–0:45 | Choose Delhi and inspect current conditions | Visible source, scale, and timestamp |
| 0:45–1:15 | Read forecast and practical advice | Explain the relative lower-exposure period |
| 1:15–1:35 | Switch to Hindi | Same data, translated guidance |
| 1:35–1:55 | Save, open History, refresh | The advisory persists and remains marked historical |
| 1:55–2:25 | Show AWS request and architecture | Real Lambda, Bedrock, and DynamoDB evidence with secrets hidden |
| 2:25–2:45 | Explain limits and learning | No safe-air guarantee; request-driven cost controls |

Do not simulate AWS success or claim measured health improvement.
Use clearly marked fixtures only to demonstrate rare errors, never as claimed live pollution readings.
Write-up sections: problem, exact scope, data limitations, AWS flow, tests, learning, AI assistance, and licenses.
The AWS Builder Center blog award is optional. Prepare a draft after there is actual build evidence.

## Acceptance plan

- Every required screen works at 390px without horizontal scrolling.
- Location denial, provider timeout, stale data, and Bedrock failure retain an honest usable interface.
- Hindi changes all user-facing controls and advice without mixing locations or timestamps.
- Saving survives refresh; failed saves show no success state; one session cannot read another session's records.
- CI passes TypeScript, production build, core UI tests, Python tests, and SAM validation.
- A public Amplify URL reaches real AWS services after the backend phase is authorized.
- Public repository history matches the build window; video opens signed out and lasts under three minutes.
- Submission is complete only when the official form returns a verifiable receipt.
