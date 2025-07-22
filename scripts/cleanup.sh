#!/bin/bash

# Clean Up Existing Service Principal and App Registration
echo "🧹 Cleaning up existing Service Principal and App Registration..."

# Configuration
PROJECT_NAME="quoteapp"
SP_NAME="sp-${PROJECT_NAME}-github"

# STEP 1: Find existing resources
echo ""
echo "1 Finding existing resources..."

# Find app registration by display name
echo "Looking for app registration with name: $SP_NAME"
EXISTING_APP_ID=$(az ad app list --display-name "$SP_NAME" --query '[0].appId' -o tsv)

if [ "$EXISTING_APP_ID" != "" ] && [ "$EXISTING_APP_ID" != "null" ]; then
    echo "Found existing app registration:"
    echo "   App ID: $EXISTING_APP_ID"
    
    # Show app details
    az ad app show --id "$EXISTING_APP_ID" --query '{appId:appId, displayName:displayName, createdDateTime:createdDateTime}' -o table
    
    # Find associated service principal
    echo ""
    echo "Looking for associated service principal..."
    EXISTING_SP_ID=$(az ad sp list --filter "appId eq '$EXISTING_APP_ID'" --query '[0].id' -o tsv)
    
    if [ "$EXISTING_SP_ID" != "" ] && [ "$EXISTING_SP_ID" != "null" ]; then
        echo "Found associated service principal:"
        echo "   Service Principal ID: $EXISTING_SP_ID"
        
        # Show service principal details
        az ad sp show --id "$EXISTING_SP_ID" --query '{id:id, appId:appId, displayName:displayName}' -o table
    else
        echo "No service principal found for this app"
    fi
else
    echo "No existing app registration found with name: $SP_NAME"
fi

# STEP 2: Show role assignments (so we know what will be cleaned up)
echo ""
echo "2 Checking current role assignments..."

if [ "$EXISTING_APP_ID" != "" ] && [ "$EXISTING_APP_ID" != "null" ]; then
    echo "Current role assignments for $EXISTING_APP_ID:"
    ROLE_ASSIGNMENTS=$(az role assignment list --assignee "$EXISTING_APP_ID" --query '[].{Role:roleDefinitionName, Scope:scope}' -o table)
    
    if [ "$ROLE_ASSIGNMENTS" != "" ]; then
        echo "$ROLE_ASSIGNMENTS"
    else
        echo "   No role assignments found"
    fi
else
    echo "   No app ID to check role assignments"
fi

# STEP 3: Interactive confirmation
echo ""
echo "3 Confirmation required..."

if [ "$EXISTING_APP_ID" != "" ] && [ "$EXISTING_APP_ID" != "null" ]; then
    echo "WARNING: This will delete:"
    echo "   - App Registration: $EXISTING_APP_ID ($SP_NAME)"
    if [ "$EXISTING_SP_ID" != "" ] && [ "$EXISTING_SP_ID" != "null" ]; then
        echo "   - Service Principal: $EXISTING_SP_ID"
    fi
    echo "   - All associated role assignments"
    echo "   - All federated credentials"
    echo ""
    
    read -p "Are you sure you want to delete these resources? (y/N): " -n 1 -r
    echo
    
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Operation cancelled by user"
        echo ""
        echo "If you want to keep existing resources, use the continue-setup.sh script instead"
        exit 0
    fi
else
    echo "No existing resources found to delete"
    echo "You can proceed directly with running the original azure-setup.sh script"
    exit 0
fi

# STEP 4: Delete service principal first
echo ""
echo "4 Deleting service principal..."

if [ "$EXISTING_SP_ID" != "" ] && [ "$EXISTING_SP_ID" != "null" ]; then
    echo "Deleting service principal: $EXISTING_SP_ID"
    
    if az ad sp delete --id "$EXISTING_SP_ID"; then
        echo "Service principal deleted successfully"
    else
        echo "Failed to delete service principal"
        echo "   You might not have permissions, or it might already be deleted"
    fi
else
    echo "No service principal to delete"
fi

# STEP 5: Delete app registration
echo ""
echo "5 Deleting app registration..."

if [ "$EXISTING_APP_ID" != "" ] && [ "$EXISTING_APP_ID" != "null" ]; then
    echo "Deleting app registration: $EXISTING_APP_ID"
    
    if az ad app delete --id "$EXISTING_APP_ID"; then
        echo "App registration deleted successfully"
    else
        echo "Failed to delete app registration"
        echo "   You might not have permissions, or it might already be deleted"
    fi
else
    echo "No app registration to delete"
fi

# STEP 6: Verify cleanup
echo ""
echo "6 Verifying cleanup..."

sleep 5  # Wait a few seconds for Azure AD to propagate changes

echo "Checking if app registration still exists..."
VERIFY_APP=$(az ad app list --display-name "$SP_NAME" --query '[0].appId' -o tsv)

if [ "$VERIFY_APP" = "" ] || [ "$VERIFY_APP" = "null" ]; then
    echo "App registration successfully removed"
else
    echo "App registration might still exist: $VERIFY_APP"
    echo "Azure AD propagation can take a few minutes"
fi

# STEP 7: Final status and next steps
echo ""
echo "Cleanup completed!"
echo ""
echo "Next steps:"
echo "1. Wait 2-3 minutes for Azure AD changes to propagate"
echo ""
echo "2. Run your original setup script"
echo ""
echo "3. If you still get conflicts, wait a few more minutes and try again"
echo ""

# STEP 8: Optional - List all your app registrations for reference
echo "For reference, here are all your current app registrations:"
az ad app list --query '[].{AppId:appId, DisplayName:displayName, CreatedDateTime:createdDateTime}' -o table | head -10

echo ""
echo "Cleanup script completed successfully!"