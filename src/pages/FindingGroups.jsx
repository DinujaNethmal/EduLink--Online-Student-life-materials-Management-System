import { useMemo, useState } from "react";

const memberPostsSeed = [
  {
    id: 1,
    name: "Nethmi Perera",
    campus: "Malabe",
    subject: "SE",
    lookingGroupType: "Research",
    gender: "Female",
    gpa: "3.62",
    showGpa: true,
    details: "Strong in React and UI. Looking for active team members.",
    miniPoster: "Need a serious group for final year project.",
  },
  {
    id: 2,
    name: "Dulaj Fernando",
    campus: "Kandy",
    subject: "DBMS",
    lookingGroupType: "Assignment",
    gender: "Male",
    gpa: "",
    showGpa: false,
    details: "Can handle backend APIs and MongoDB schema design.",
    miniPoster: "Looking for a backend focused team.",
  },
];

const groupBannersSeed = [
  {
    id: 1,
    groupName: "Team Quantum",
    leaderName: "Sahan",
    campus: "Malabe",
    subject: "OOP",
    subgroup: "Development",
    wantedGender: "Any",
    minGpa: "3.0",
    details: "We need 1 member for frontend + testing.",
    banner: "We want members to our group. Please DM.",
  },
  {
    id: 2,
    groupName: "Data Spark",
    leaderName: "Nimali",
    campus: "Metro",
    subject: "DSA",
    subgroup: "Research",
    wantedGender: "Female",
    minGpa: "2.8",
    details: "Need one student with strong algorithm basics.",
    banner: "Open spot available now. Join us!",
  },
];

const filterDefaults = {
  campus: "All",
  subject: "All",
  groupType: "All",
  gender: "All",
};

const newMemberDefault = {
  name: "",
  campus: "Malabe",
  subject: "SE",
  lookingGroupType: "Research",
  gender: "Any",
  gpa: "",
  showGpa: false,
  details: "",
  miniPoster: "",
};

const newBannerDefault = {
  groupName: "",
  leaderName: "",
  campus: "Malabe",
  subject: "SE",
  subgroup: "Development",
  wantedGender: "Any",
  minGpa: "",
  details: "",
  banner: "",
};

export default function FindingGroups() {
  const [activeTab, setActiveTab] = useState("member");
  const [filters, setFilters] = useState(filterDefaults);
  const [memberPosts, setMemberPosts] = useState(memberPostsSeed);
  const [groupBanners, setGroupBanners] = useState(groupBannersSeed);
  const [memberForm, setMemberForm] = useState(newMemberDefault);
  const [bannerForm, setBannerForm] = useState(newBannerDefault);

  const filteredMemberPosts = useMemo(
    () =>
      memberPosts.filter(
        (post) =>
          (filters.campus === "All" || post.campus === filters.campus) &&
          (filters.subject === "All" || post.subject === filters.subject) &&
          (filters.groupType === "All" ||
            post.lookingGroupType === filters.groupType) &&
          (filters.gender === "All" || post.gender === filters.gender)
      ),
    [memberPosts, filters]
  );

  const filteredGroupBanners = useMemo(
    () =>
      groupBanners.filter(
        (banner) =>
          (filters.campus === "All" || banner.campus === filters.campus) &&
          (filters.subject === "All" || banner.subject === filters.subject) &&
          (filters.groupType === "All" || banner.subgroup === filters.groupType) &&
          (filters.gender === "All" || banner.wantedGender === filters.gender)
      ),
    [groupBanners, filters]
  );

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleMemberFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setMemberForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleBannerFormChange = (e) => {
    const { name, value } = e.target;
    setBannerForm((prev) => ({ ...prev, [name]: value }));
  };

  const submitMemberPost = (e) => {
    e.preventDefault();
    if (!memberForm.name.trim() || !memberForm.miniPoster.trim()) return;

    setMemberPosts((prev) => [
      {
        id: Date.now(),
        ...memberForm,
      },
      ...prev,
    ]);
    setMemberForm(newMemberDefault);
  };

  const submitGroupBanner = (e) => {
    e.preventDefault();
    if (!bannerForm.groupName.trim() || !bannerForm.banner.trim()) return;

    setGroupBanners((prev) => [
      {
        id: Date.now(),
        ...bannerForm,
      },
      ...prev,
    ]);
    setBannerForm(newBannerDefault);
  };

  return (
    <div className="groups-page">
      <section className="groups-hero">
        <h1>Finding Groups</h1>
        <p>
          Post your request, discover matching students, and build the right
          project team with smart filters.
        </p>
      </section>

      <section className="groups-filter-card">
        <h2>Filter Posters & Banners</h2>
        <div className="groups-filter-grid">
          <div className="field-group">
            <label htmlFor="campus">Campus</label>
            <select
              id="campus"
              name="campus"
              value={filters.campus}
              onChange={handleFilterChange}
            >
              <option>All</option>
              <option>Malabe</option>
              <option>Metro</option>
              <option>Kandy</option>
              <option>Matara</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
            >
              <option>All</option>
              <option>SE</option>
              <option>DBMS</option>
              <option>DSA</option>
              <option>OOP</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="groupType">Group / Subgroup Type</label>
            <select
              id="groupType"
              name="groupType"
              value={filters.groupType}
              onChange={handleFilterChange}
            >
              <option>All</option>
              <option>Research</option>
              <option>Development</option>
              <option>Assignment</option>
            </select>
          </div>

          <div className="field-group">
            <label htmlFor="gender">Gender Preference</label>
            <select
              id="gender"
              name="gender"
              value={filters.gender}
              onChange={handleFilterChange}
            >
              <option>All</option>
              <option>Any</option>
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>
        </div>
      </section>

      <section className="groups-tab-row">
        <button
          className={`groups-tab ${activeTab === "member" ? "active" : ""}`}
          onClick={() => setActiveTab("member")}
          type="button"
        >
          I Need a Group
        </button>
        <button
          className={`groups-tab ${activeTab === "banner" ? "active" : ""}`}
          onClick={() => setActiveTab("banner")}
          type="button"
        >
          Our Group Needs Members
        </button>
      </section>

      <div className="groups-layout">
        {activeTab === "member" ? (
          <>
            <section className="groups-card">
              <h2>Create Member Poster</h2>
              <form className="auth-form" onSubmit={submitMemberPost}>
                <div className="profile-form-row">
                  <div className="field-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      id="name"
                      name="name"
                      value={memberForm.name}
                      onChange={handleMemberFormChange}
                      placeholder="e.g. Kasun Perera"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="memberCampus">Campus</label>
                    <select
                      id="memberCampus"
                      name="campus"
                      value={memberForm.campus}
                      onChange={handleMemberFormChange}
                    >
                      <option>Malabe</option>
                      <option>Metro</option>
                      <option>Kandy</option>
                      <option>Matara</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="memberSubject">Main Subject</label>
                    <select
                      id="memberSubject"
                      name="subject"
                      value={memberForm.subject}
                      onChange={handleMemberFormChange}
                    >
                      <option>SE</option>
                      <option>DBMS</option>
                      <option>DSA</option>
                      <option>OOP</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="field-group">
                    <label htmlFor="lookingGroupType">Looking Group Type</label>
                    <select
                      id="lookingGroupType"
                      name="lookingGroupType"
                      value={memberForm.lookingGroupType}
                      onChange={handleMemberFormChange}
                    >
                      <option>Research</option>
                      <option>Development</option>
                      <option>Assignment</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="memberGender">Gender</label>
                    <select
                      id="memberGender"
                      name="gender"
                      value={memberForm.gender}
                      onChange={handleMemberFormChange}
                    >
                      <option>Any</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="gpa">GPA (Optional)</label>
                    <input
                      id="gpa"
                      name="gpa"
                      type="text"
                      value={memberForm.gpa}
                      onChange={handleMemberFormChange}
                      placeholder="e.g. 3.45"
                      disabled={!memberForm.showGpa}
                    />
                  </div>
                </div>

                <label className="groups-checkbox">
                  <input
                    type="checkbox"
                    name="showGpa"
                    checked={memberForm.showGpa}
                    onChange={handleMemberFormChange}
                  />
                  Display my GPA in poster
                </label>

                <div className="field-group">
                  <label htmlFor="details">Details</label>
                  <input
                    id="details"
                    name="details"
                    value={memberForm.details}
                    onChange={handleMemberFormChange}
                    placeholder="Your skills, tools, preferred role, etc."
                  />
                </div>

                <div className="field-group">
                  <label htmlFor="miniPoster">Mini Poster Message</label>
                  <textarea
                    id="miniPoster"
                    name="miniPoster"
                    value={memberForm.miniPoster}
                    onChange={handleMemberFormChange}
                    rows={3}
                    placeholder="Short message about the group you want."
                  />
                </div>

                <button type="submit" className="btn-primary btn-full">
                  Post Member Poster
                </button>
              </form>
            </section>

            <section className="groups-card">
              <h2>Member Posters</h2>
              <div className="groups-list">
                {filteredMemberPosts.map((post) => (
                  <article key={post.id} className="group-poster">
                    <div className="group-poster-top">
                      <h3>{post.name}</h3>
                      <span className="profile-pill">{post.campus}</span>
                    </div>
                    <p className="group-poster-message">"{post.miniPoster}"</p>
                    <div className="group-tags">
                      <span>{post.subject}</span>
                      <span>{post.lookingGroupType}</span>
                      <span>{post.gender}</span>
                      {post.showGpa && post.gpa ? <span>GPA {post.gpa}</span> : null}
                    </div>
                    <p className="profile-note">{post.details}</p>
                  </article>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <section className="groups-card">
              <h2>Create Group Banner</h2>
              <form className="auth-form" onSubmit={submitGroupBanner}>
                <div className="profile-form-row">
                  <div className="field-group">
                    <label htmlFor="groupName">Group Name</label>
                    <input
                      id="groupName"
                      name="groupName"
                      value={bannerForm.groupName}
                      onChange={handleBannerFormChange}
                      placeholder="e.g. Team Vision"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="leaderName">Leader Name</label>
                    <input
                      id="leaderName"
                      name="leaderName"
                      value={bannerForm.leaderName}
                      onChange={handleBannerFormChange}
                      placeholder="e.g. Lahiru"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="bannerCampus">Campus</label>
                    <select
                      id="bannerCampus"
                      name="campus"
                      value={bannerForm.campus}
                      onChange={handleBannerFormChange}
                    >
                      <option>Malabe</option>
                      <option>Metro</option>
                      <option>Kandy</option>
                      <option>Matara</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="field-group">
                    <label htmlFor="bannerSubject">Subject</label>
                    <select
                      id="bannerSubject"
                      name="subject"
                      value={bannerForm.subject}
                      onChange={handleBannerFormChange}
                    >
                      <option>SE</option>
                      <option>DBMS</option>
                      <option>DSA</option>
                      <option>OOP</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="subgroup">Wanted Subgroup</label>
                    <select
                      id="subgroup"
                      name="subgroup"
                      value={bannerForm.subgroup}
                      onChange={handleBannerFormChange}
                    >
                      <option>Development</option>
                      <option>Research</option>
                      <option>Documentation</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="wantedGender">Wanted Gender</label>
                    <select
                      id="wantedGender"
                      name="wantedGender"
                      value={bannerForm.wantedGender}
                      onChange={handleBannerFormChange}
                    >
                      <option>Any</option>
                      <option>Male</option>
                      <option>Female</option>
                    </select>
                  </div>
                </div>

                <div className="profile-form-row">
                  <div className="field-group">
                    <label htmlFor="minGpa">Minimum GPA Needed</label>
                    <input
                      id="minGpa"
                      name="minGpa"
                      value={bannerForm.minGpa}
                      onChange={handleBannerFormChange}
                      placeholder="e.g. 3.00 (optional)"
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="bannerDetails">Details</label>
                    <input
                      id="bannerDetails"
                      name="details"
                      value={bannerForm.details}
                      onChange={handleBannerFormChange}
                      placeholder="Skills and responsibilities needed."
                    />
                  </div>
                  <div className="field-group">
                    <label htmlFor="banner">Banner Message</label>
                    <input
                      id="banner"
                      name="banner"
                      value={bannerForm.banner}
                      onChange={handleBannerFormChange}
                      placeholder="We want members. Please DM."
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary btn-full">
                  Post Group Banner
                </button>
              </form>
            </section>

            <section className="groups-card">
              <h2>Group Recruitment Banners</h2>
              <div className="groups-list">
                {filteredGroupBanners.map((banner) => (
                  <article key={banner.id} className="group-poster group-banner">
                    <div className="group-poster-top">
                      <h3>{banner.groupName}</h3>
                      <span className="profile-pill">{banner.campus}</span>
                    </div>
                    <p className="group-poster-message">"{banner.banner}"</p>
                    <div className="group-tags">
                      <span>{banner.subject}</span>
                      <span>{banner.subgroup}</span>
                      <span>Gender: {banner.wantedGender}</span>
                      {banner.minGpa ? <span>Min GPA {banner.minGpa}</span> : null}
                    </div>
                    <p className="profile-note">
                      Leader: {banner.leaderName || "N/A"} | {banner.details}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
