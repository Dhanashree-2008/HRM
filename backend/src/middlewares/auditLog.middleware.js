// src/middlewares/auditLog.middleware.js
import { createAuditLog } from "../services/auditLog.service.js";

/**
 * Middleware to log admin actions
 * Usage: router.post("/employees", auditLogMiddleware("CREATE_EMPLOYEE", "EMPLOYEE"), controller);
 */
export const auditLogMiddleware = (action, entityType) => {
  return async (req, res, next) => {
    // Store original res.json to intercept response
    const originalJson = res.json.bind(res);
    
    res.json = async function(data) {
      // Only log successful operations (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          const entityId = req.params?.id || data?.employee?.id || data?.id || null;
          const description = `${action} - ${entityType}${entityId ? ` #${entityId}` : ""}`;
          
          // Extract changes if available
          let changes = null;
          if (req.method === "PUT" || req.method === "PATCH") {
            changes = {
              before: req.body, // In real app, fetch current state
              after: data,
            };
          }

          await createAuditLog({
            userId: req.user?.id,
            action,
            entityType,
            entityId,
            description,
            changes,
            ipAddress: req.ip || req.connection.remoteAddress,
            userAgent: req.get("user-agent"),
          });
        } catch (error) {
          // Don't fail the request if audit logging fails
          console.error("Audit log error:", error.message);
        }
      }
      
      return originalJson(data);
    };
    
    next();
  };
};



