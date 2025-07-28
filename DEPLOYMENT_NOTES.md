# Deployment Attempt Notes - Knowlegather

## Context
Deployment attempts for Knowlegather project to Google Cloud Run. Initial deployment faced issues due to missing configurations and permissions.

## Key Problems and Resolutions

1. **Secret Empty Issue**
   - **Problem:** `GCP_SA_KEY` secret was empty in GitHub.
   - **Resolution:** Generated new JSON key and updated in GitHub secrets.

2. **Artifact Registry Permissions**
   - **Problem:** Lack of permission to create repository on push.
   - **Resolution:** Granted `artifactregistry.repoAdmin` permission.

3. **Missing GCR Repository**
   - **Problem:** `gcr.io` repo needed to be manually created.
   - **Resolution:** Used `gcloud` to create `gcr.io` repository in Artifact Registry.

4. **Improved Google Cloud Auth**
   - **Problem:** Previous auth method in workflow failed.
   - **Resolution:** Modified workflow to use `google-github-actions/auth@v2` for better authentication.

## Strategies Moving Forward
- **Regularly Validate Secrets** - Ensure all necessary secrets are set correctly.
- **Check Permissions** - Double check each role when creating service accounts.
- **Initial Manual Setup** - Some resources may need an initial manual setup to avoid errors in CI/CD.

## Outcome
With these corrections, the deployment pipeline should now push the Docker image to Google Cloud Registry and deploy to Cloud Run successfully.

## Next Steps
1. Verify deployment in Google Cloud Console.
2. Monitor the application running on Cloud Run.
3. Iterate and improve CI/CD based on observations.
