import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("http://localhost:5000/api/profile", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await res.json();
      setProfile(data);
    };

    fetchProfile();
  }, []);

  if (!profile) return <p>Loading...</p>;

  return (
    <div className="bg-white p-6 rounded-xl shadow max-w-2xl">

      <h2 className="text-2xl font-bold mb-4 text-green-700">
        👤 Farmer Profile
      </h2>

      <div className="grid grid-cols-2 gap-4">

        <p><strong>Name:</strong> {profile.name}</p>
        <p><strong>Email:</strong> {profile.email}</p>

        <p><strong>State:</strong> {profile.state}</p>
        <p><strong>District:</strong> {profile.district}</p>

        <p><strong>Village:</strong> {profile.village}</p>
        <p><strong>Water:</strong> {profile.water}</p>

        <p><strong>Land:</strong> {profile.land}</p>
        <p><strong>Phone:</strong> {profile.phone}</p>

        <p className="col-span-2">
          <strong>Location:</strong> {profile.location}
        </p>

      </div>

    </div>
  );
}

export default Profile;