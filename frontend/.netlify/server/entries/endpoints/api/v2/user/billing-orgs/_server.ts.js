import { error } from "@sveltejs/kit";
import { s as superjsonResponse } from "../../../../../../chunks/superjsonResponse.js";
import { c as config } from "../../../../../../chunks/config.js";
import { collections } from "../../../../../../chunks/database.js";
import { a as authCondition } from "../../../../../../chunks/auth.js";
import { l as logger } from "../../../../../../chunks/logger.js";
const GET = async ({ locals }) => {
  if (!config.isHuggingChat) {
    error(404, "Not available");
  }
  if (!locals.user) {
    error(401, "Login required");
  }
  if (!locals.token) {
    error(401, "OAuth token not available. Please log out and log back in.");
  }
  try {
    const response = await fetch("https://huggingface.co/oauth/userinfo", {
      headers: { Authorization: `Bearer ${locals.token}` }
    });
    if (!response.ok) {
      logger.error(`Failed to fetch billing orgs: ${response.status}`);
      error(502, "Failed to fetch billing information");
    }
    const data = await response.json();
    const settings = await collections.settings.findOne(authCondition(locals));
    const currentBillingOrg = settings?.billingOrganization;
    const billingOrgs = (data.orgs ?? []).filter((org) => org.plan || org.canPay === true).map((org) => ({
      sub: org.sub,
      name: org.name,
      preferred_username: org.preferred_username
    }));
    const isCurrentOrgValid = !currentBillingOrg || billingOrgs.some(
      (org) => org.preferred_username === currentBillingOrg
    );
    if (!isCurrentOrgValid && currentBillingOrg) {
      logger.info(
        `Clearing invalid billingOrganization '${currentBillingOrg}' for user ${locals.user._id}`
      );
      await collections.settings.updateOne(authCondition(locals), {
        $unset: { billingOrganization: "" },
        $set: { updatedAt: /* @__PURE__ */ new Date() }
      });
    }
    return superjsonResponse({
      userCanPay: data.canPay ?? false,
      organizations: billingOrgs,
      currentBillingOrg: isCurrentOrgValid ? currentBillingOrg : void 0
    });
  } catch (err) {
    if (err && typeof err === "object" && "status" in err) {
      throw err;
    }
    logger.error(err, "Error fetching billing orgs:");
    error(500, "Internal server error");
  }
};
export {
  GET
};
