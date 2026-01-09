import { Outlet } from "react-router-dom";
import "../styles/MainLayout.css";

export default function MainLayout() {
  return (
    <div className="main-layout">
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  );
}
