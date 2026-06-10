import { Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Layout from "./Layout";
import SoilReport from "./pages/SoilReport";
import Recommendation from "./pages/Recommendation";
import Fertilizer from "./pages/Fertilizer";
import Pesticide from "./pages/Pesticide";
import Weather from "./pages/Weather";
import Mandi from "./pages/Mandi";
import FarmHistory from "./pages/FarmHistory";
import Learning from "./pages/Learning";
import Settings from "./pages/Settings";


function App() {
  return (
    <Routes>

      <Route path="/" element={<Auth />} />

      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />

      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />

      <Route
        path="/soil"
        element={
          <Layout>
            <SoilReport />
          </Layout>
        }
      />

      <Route
        path="/recommendation"
        element={
          <Layout>
            <Recommendation />
          </Layout>


        }
      />

      <Route
        path="/recommend"
        element={
          <Layout>
            <Recommendation />
          </Layout>


        }
      />

      <Route
        path="/fertilizer"
        element={
          <Layout>
            <Fertilizer />
          </Layout>

        }
      />

      <Route
        path="/pesticide"
        element={
          <Layout>
            <Pesticide />
          </Layout>
        }
      />

      <Route
        path="/weather"
        element={
          <Layout>
            <Weather />
          </Layout>
        }
      />

      <Route
        path="/mandi"
        element={
          <Layout>
            <Mandi />
          </Layout>
        }
      />

      <Route
        path="/farm"
        element={
          <Layout>
            <FarmHistory />
          </Layout>
        }
      />

      <Route
        path="/learning"
        element={
          <Layout>
            <Learning />
          </Layout>
        }
      />

      <Route
        path="/settings"
        element={
          <Layout>
            <Settings />
          </Layout>
        }
      />

    </Routes>
  );
}

export default App;