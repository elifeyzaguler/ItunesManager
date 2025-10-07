import "./App.css";
import ArtistList from "./components/ArtistList";
import TrackList from "./components/TrackList";
import HomePage from "./pages/HomePage";
import Sidebar from "./components/Sidebar";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AboutMe from "./pages/AboutMePage";
import AdminLogin from "./pages/AdminLoginPage";
import AboutProject from "./pages/AboutProjectPage";
import ArtistPage from "./pages/ArtistPage";
import AdminDashboard from "./pages/AdminDashboard";
import TrackManagementPage from "./pages/TrackManagementPage";
import { Toaster } from "react-hot-toast";
import ArtistManagementPage from "./pages/ArtistManagementPage";
import AlbumManagementPage from "./pages/AlbumManagementPage";
import PlaylistsPage from "./pages/PlaylistsPage";
import PlaylistTracksPage from "./pages/PlaylistTracksPage";
import EditPlaylistListPage from "./pages/EditPlaylistListPage";
import EditPlaylistPage from "./pages/EditPlaylistPage";
import EditCustomersPage from "./pages/EditCustomersPage";
import AdminEmployeesPage from "./pages/EditEmployeesPage";
import AlbumList from "./pages/AlbumListPage";
import AlbumPage from "./pages/AlbumPage";
function App() {
  return (
    <Router>
      <div className="flex">
        <Sidebar />
        <Toaster position="top-right" />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/artists" element={<ArtistList />} />
            <Route path="/tracks" element={<TrackList />} />
            <Route path="/albums" element={<AlbumList />} />
            <Route path="/contact" element={<div>Contact Page</div>} />
            <Route path="/aboutme" element={<AboutMe />} />
            <Route path="/adminlogin" element={<AdminLogin />} />
            <Route path="/aboutproject" element={<AboutProject />} />
            <Route path="/artist/:artist_id" element={<ArtistPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/edit-tracks" element={<TrackManagementPage />} />
            <Route path="/edit-artists" element={<ArtistManagementPage />} />
            <Route path="/edit-albums" element={<AlbumManagementPage />} />
            <Route path="/playlists" element={<PlaylistsPage />} />
            <Route path="/playlists-admin" element={<EditPlaylistListPage />} />
            <Route path="/edit-customers" element={<EditCustomersPage />} />
            <Route path="/edit-employees" element={<AdminEmployeesPage />} />
            <Route
              path="/edit-playlist/:playlistId"
              element={<EditPlaylistPage />}
            />
            <Route
              path="/playlists/:playlistId"
              element={<PlaylistTracksPage />}
            />
            <Route path="/albums/:album_id" element={<AlbumPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
