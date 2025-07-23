#!/bin/bash

# Azure Setup Script for Development Environment

set -e  # Exit on any error

echo "Starting Azure setup for development environment..."

# Configuration - UPDATE THESE VALUES
export PROJECT_NAME="quoteapp"             
export GITHUB_REPO_OWNER="masudmirza"          
export GITHUB_REPO_NAME="Quote-App-Sigli"       
export LOCATION="francecentral" 

# Derived values
export SUBSCRIPTION_ID=$(az account show --query id -o tsv)
export TENANT_ID=$(az account show --query tenantId -o tsv)
export TFSTATE_RG_NAME="rg-${PROJECT_NAME}-tfstate"
export TFSTATE_SA_NAME="${PROJECT_NAME}tfs1753203539"
export SP_NAME="sp-${PROJECT_NAME}-github"

echo "Project: ${PROJECT_NAME}"
echo "Subscription: ${SUBSCRIPTION_ID}"
echo "Tenant: ${TENANT_ID}"
echo "GitHub Repo: ${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}"
echo ""

# STEP 1: Create Storage Account for Terraform State

echo "Creating storage account for Terraform state..."

az group create \
  --name $TFSTATE_RG_NAME \
  --location "$LOCATION" \
  --tags project=$PROJECT_NAME purpose=terraform-state

echo "Resource group created: $TFSTATE_RG_NAME"

az storage account create \
  --resource-group $TFSTATE_RG_NAME \
  --name $TFSTATE_SA_NAME \
  --sku Standard_LRS \
  --encryption-services blob \
  --https-only true \
  --min-tls-version TLS1_2 \
  --allow-blob-public-access false \
  --tags project=$PROJECT_NAME

echo "Storage account created: $TFSTATE_SA_NAME"

az storage container create \
  --name tfstate \
  --account-name $TFSTATE_SA_NAME

echo "Storage account created: $TFSTATE_SA_NAME"

# STEP 2: Create Service Principal

echo "Creating Service Principal for GitHub Actions..."

APP_ID=$(az ad app create \
  --display-name $SP_NAME \
  --query appId -o tsv)

az ad sp create --id $APP_ID

echo "Service Principal created: $APP_ID"

# STEP 3: Assign Permissions
echo "Assigning permissions..."

az role assignment create \
  --assignee $APP_ID \
  --role Contributor \
  --scope "/subscriptions/$SUBSCRIPTION_ID"

az role assignment create \
  --assignee $APP_ID \
  --role "Storage Blob Data Contributor" \
  --scope "/subscriptions/$SUBSCRIPTION_ID/resourceGroups/$TFSTATE_RG_NAME/providers/Microsoft.Storage/storageAccounts/$TFSTATE_SA_NAME"

echo "Permissions assigned"

# STEP 4: Create Federated Credentials (OIDC)

echo "Setting up OIDC authentication..."

az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "main-branch-credential",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$GITHUB_REPO_OWNER'/'$GITHUB_REPO_NAME':ref:refs/heads/main",
    "audiences": ["api://AzureADTokenExchange"]
  }'

az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "pull-request-credential",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$GITHUB_REPO_OWNER'/'$GITHUB_REPO_NAME':pull_request",
    "audiences": ["api://AzureADTokenExchange"]
  }'

az ad app federated-credential create \
  --id $APP_ID \
  --parameters '{
    "name": "development-environment-credential",
    "issuer": "https://token.actions.githubusercontent.com",
    "subject": "repo:'$GITHUB_REPO_OWNER'/'$GITHUB_REPO_NAME':environment:development",
    "audiences": ["api://AzureADTokenExchange"]
  }'

echo "OIDC credentials configured"

# STEP 6: Create Backend Configuration

echo "Creating Terraform backend configuration..."

cat > "../infra/backend.tf" << EOF
terraform {
  backend "azurerm" {
    resource_group_name  = "$TFSTATE_RG_NAME"
    storage_account_name = "$TFSTATE_SA_NAME"
    container_name       = "tfstate"
    key                  = "development.tfstate"
    use_oidc            = true
  }
}
EOF

echo "Backend configuration created"

# STEP 7: Save Information

cat > "azure-setup-info.txt" << EOF
Azure Setup Complete - $(date)
============================

Project: $PROJECT_NAME
GitHub Repo: $GITHUB_REPO_OWNER/$GITHUB_REPO_NAME

Azure Resources:
- Subscription ID: $SUBSCRIPTION_ID  
- Tenant ID: $TENANT_ID
- Resource Group: $TFSTATE_RG_NAME
- Storage Account: $TFSTATE_SA_NAME
- Service Principal ID: $APP_ID

Next Steps:
1. Add the GitHub secrets shown above
2. Create GitHub environment: 'development'  
3. Update Terraform variables with your database info
4. Commit and push your code
EOF

echo ""
echo "Azure setup complete!"
echo "Configuration saved to azure-setup-info.txt"
echo ""
echo "Next: Add GitHub secrets and continue to Chapter 5"


# chmod +x azure-setup.sh
# ./azure-setup.sh