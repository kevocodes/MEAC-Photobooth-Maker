import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { PublicRoutes } from "@/constants/routes";
import PhotoUpload from "@/pages/PhotoUpload";
import PDFDownload from "@/pages/PDFDownload";
import MainLayout from "@/layouts/MainLayout";
import PrintedPhotos from "@/pages/PrintedPhotos";

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path={PublicRoutes.Home} element={<PhotoUpload />} />
          <Route path={PublicRoutes.PDFDownload} element={<PDFDownload />} />
          <Route path={PublicRoutes.PrintedPhotos} element={<PrintedPhotos />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
