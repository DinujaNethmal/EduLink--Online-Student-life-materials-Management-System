import { useMemo, useState } from "react";

const initialProfile = {
  fullName: "Student Name",
  email: "it12345678@my.sliit.lk",
  campus: "Malabe",
  year: "3",
  semester: "2",
  hasGroup: "yes",
  groupName: "Team Alpha",
  degreeProgram: "BSc (Hons) in IT",
  bio: "Interested in full-stack development and teamwork projects.",
};

const initialQuizMarks = [
  { quiz: "Quiz 1", module: "SE", marks: 78 },
  { quiz: "Quiz 2", module: "DSA", marks: 84 },
  { quiz: "Quiz 3", module: "DBMS", marks: 72 },
  { quiz: "Quiz 4", module: "OOP", marks: 90 },
];

export default function Profile() {
  const [profile, setProfile] = useState(initialProfile);
  const [quizMarks] = useState(initialQuizMarks);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  const average = useMemo(() => {
    if (!quizMarks.length) return 0;
    const total = quizMarks.reduce((sum, item) => sum + item.marks, 0);
    return Math.round(total / quizMarks.length);
  }, [quizMarks]);

  const highest = useMemo(() => {
    if (!quizMarks.length) return 0;
    return Math.max(...quizMarks.map((item) => item.marks));
  }, [quizMarks]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
    setSaveMessage("");
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setProfilePhoto(localUrl);
    setSaveMessage("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveMessage("Profile saved locally. API integration can be connected next.");
  };

  return (
    <div className="profile-page">
      <div className="profile-header-card">
        <div className="profile-avatar-wrap">
          {profilePhoto ? (
            <img src={profilePhoto} alt="Profile" className="profile-avatar" />
          ) : (
            <div className="profile-avatar profile-avatar-fallback">
              {profile.fullName.slice(0, 2).toUpperCase()}
            </div>
          )}
          <label className="btn-secondary profile-upload-btn">
            Add Profile Photo
            <input type="file" accept="image/*" onChange={handlePhotoChange} />
          </label>
        </div>

        <div>
          <h1 className="profile-title">{profile.fullName}</h1>
          <p className="profile-subtitle">{profile.degreeProgram}</p>
          <div className="profile-pill-row">
            <span className="profile-pill">{profile.campus} Campus</span>
            <span className="profile-pill">
              Year {profile.year} - Semester {profile.semester}
            </span>
            <span className="profile-pill">
              {profile.hasGroup === "yes"
                ? `Group: ${profile.groupName || "Assigned"}`
                : "No Group Yet"}
            </span>
          </div>
        </div>
      </div>

      <div className="profile-grid">
        <section className="profile-card">
          <h2>Profile Details</h2>
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="field-group">
              <label htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                value={profile.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="field-group">
              <label htmlFor="email">University Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleChange}
              />
            </div>

            <div className="profile-form-row">
              <div className="field-group">
                <label htmlFor="campus">Campus</label>
                <select
                  id="campus"
                  name="campus"
                  value={profile.campus}
                  onChange={handleChange}
                >
                  <option>Malabe</option>
                  <option>Metro</option>
                  <option>Kandy</option>
                  <option>Matara</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="year">Academic Year</label>
                <select
                  id="year"
                  name="year"
                  value={profile.year}
                  onChange={handleChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="semester">Semester</label>
                <select
                  id="semester"
                  name="semester"
                  value={profile.semester}
                  onChange={handleChange}
                >
                  <option value="1">1</option>
                  <option value="2">2</option>
                </select>
              </div>
            </div>

            <div className="profile-form-row">
              <div className="field-group">
                <label htmlFor="hasGroup">Have Group?</label>
                <select
                  id="hasGroup"
                  name="hasGroup"
                  value={profile.hasGroup}
                  onChange={handleChange}
                >
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="groupName">Group Name</label>
                <input
                  id="groupName"
                  name="groupName"
                  value={profile.groupName}
                  onChange={handleChange}
                  disabled={profile.hasGroup !== "yes"}
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="bio">Short Bio</label>
              <input
                id="bio"
                name="bio"
                value={profile.bio}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="btn-primary btn-full">
              Save Profile
            </button>
            {saveMessage && <p className="profile-save-msg">{saveMessage}</p>}
          </form>
        </section>

        <section className="profile-card">
          <h2>Quiz Performance Summary</h2>
          <p className="profile-note">
            This section is ready for real quiz data once your teammate completes
            the quiz update and pushes to GitHub.
          </p>

          <div className="summary-stats">
            <div className="summary-stat">
              <span>Average</span>
              <strong>{average}%</strong>
            </div>
            <div className="summary-stat">
              <span>Highest</span>
              <strong>{highest}%</strong>
            </div>
            <div className="summary-stat">
              <span>Attempts</span>
              <strong>{quizMarks.length}</strong>
            </div>
          </div>

          <div className="profile-table-wrap">
            <table className="profile-table">
              <thead>
                <tr>
                  <th>Quiz</th>
                  <th>Module</th>
                  <th>Marks</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {quizMarks.map((item) => (
                  <tr key={item.quiz}>
                    <td>{item.quiz}</td>
                    <td>{item.module}</td>
                    <td>{item.marks}%</td>
                    <td>{item.marks >= 75 ? "A/B" : "C or below"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bar-chart">
            {quizMarks.map((item) => (
              <div key={`${item.quiz}-bar`} className="bar-item">
                <span>{item.quiz}</span>
                <div className="bar-track">
                  <div
                    className="bar-fill"
                    style={{ width: `${item.marks}%` }}
                    title={`${item.marks}%`}
                  />
                </div>
                <strong>{item.marks}%</strong>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
