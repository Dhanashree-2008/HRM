import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/role.middleware.js";
import {
  myLeaveBalanceController,
  getLeaveBalanceByEmployeeIdController
} from "../controllers/leaveBalance.controller.js";

import {
  initLeaveBalanceForAllEmployeesController,
} from "../controllers/leaveBalance.controller.js";


const router = Router();

router.get(
  "/my",
  authMiddleware,
  checkRole(["EMPLOYEE"]),
  myLeaveBalanceController
);

router.get(
  "/:employeeId",
  authMiddleware,
  checkRole(["ADMIN", "MANAGER"]),
  getLeaveBalanceByEmployeeIdController
);


// EMPLOYEE
router.get(
  "/my",
  authMiddleware,
  checkRole(["EMPLOYEE"]),
  myLeaveBalanceController
);



// ✅ ADMIN – ALL employees
router.post(
  "/init-all",
  authMiddleware,
  checkRole(["ADMIN"]),
  initLeaveBalanceForAllEmployeesController
);


export default router;





