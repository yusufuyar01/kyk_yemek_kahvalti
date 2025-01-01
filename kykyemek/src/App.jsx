import React from "react";
import "./MobileMealPlanner.css";

export default function MaintenancePage() {
  return (
    <div class="status-container">
  <div class="status-dot"></div>
  <div class="status-message">
    <span class="moving-text">Site Bakımda</span>
    <span class="fixed-text"> - 2 gün sonra aktif olacak</span>
  </div>
</div>
  );
}
