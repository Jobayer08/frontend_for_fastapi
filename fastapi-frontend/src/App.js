// App.js - Enhanced with better UX and design
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

export default function App() {
  const API = "https://fastapi-ml-project-gu9k.onrender.com";

  // 🔐 Auth
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [authMessage, setAuthMessage] = useState({ type: "", text: "" });

  // Form state
  const [form, setForm] = useState({
    age: "",
    gender: "",
    location: "",
    family_size: "",
    mother_education: "",
    father_education: "",
    mother_job: "",
    father_job: "",
    guardian: "",
    parental_involvement: "",
    internet_access: "",
    studytime: "",
    tutoring: "",
    school_type: "",
    attendance: "",
    extra_curricular_activities: "",
    english: "",
    math: "",
    science: "",
    social_science: "",
    art_culture: "",
  });

  const [result, setResult] = useState("");

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Show temporary message
  const showMessage = (type, text) => {
    setAuthMessage({ type, text });
    setTimeout(() => setAuthMessage({ type: "", text: "" }), 3000);
  };

  // 🔐 Register
  const register = async () => {
    if (!username || !password) {
      showMessage("error", "Please enter username and password");
      return;
    }
    setIsLoading(true);
    try {
      await axios.post(`${API}/register`, { username, password });
      showMessage("success", "✅ Registered successfully!");
    } catch (err) {
      showMessage("error", "❌ Registration failed. User may exist.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔐 Login
  const login = async () => {
    if (!username || !password) {
      showMessage("error", "Please enter username and password");
      return;
    }
    setIsLoading(true);
    try {
      const res = await axios.post(
        `${API}/login`,
        new URLSearchParams({ username, password })
      );
      setToken(res.data.access_token);
      showMessage("success", "✅ Login successful!");
    } catch (err) {
      showMessage("error", "❌ Login failed. Check credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  // 🤖 Predict
  const predict = async () => {
    if (!token) {
      showMessage("error", "Please login first!");
      return;
    }

    // Validate required fields
    const requiredFields = ["age", "studytime", "attendance", "english", "math", "science"];
    const missing = requiredFields.filter(field => !form[field]);
    if (missing.length > 0) {
      showMessage("error", `Please fill: ${missing.join(", ")}`);
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        ...form,
        age: Number(form.age),
        family_size: Number(form.family_size),
        studytime: Number(form.studytime),
        attendance: Number(form.attendance),
        english: Number(form.english),
        math: Number(form.math),
        science: Number(form.science),
        social_science: Number(form.social_science),
        art_culture: Number(form.art_culture),
      };

      const res = await axios.post(`${API}/predict`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResult(res.data.predicted_group);
      showMessage("success", "✨ Prediction complete!");
      
      // Smooth scroll to result
      setTimeout(() => {
        document.getElementById("result-section")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      showMessage("error", "❌ Prediction failed. Try again.");
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      age: "",
      gender: "",
      location: "",
      family_size: "",
      mother_education: "",
      father_education: "",
      mother_job: "",
      father_job: "",
      guardian: "",
      parental_involvement: "",
      internet_access: "",
      studytime: "",
      tutoring: "",
      school_type: "",
      attendance: "",
      extra_curricular_activities: "",
      english: "",
      math: "",
      science: "",
      social_science: "",
      art_culture: "",
    });
    setResult("");
    showMessage("success", "Form cleared!");
  };

  // Reusable Field Component with icons
  const Field = ({ label, name, type = "text", hint, options, min, max, icon }) => {
    const getIcon = () => {
      const icons = {
        age: "🎂", gender: "👤", location: "📍", family_size: "👨‍👩‍👧", 
        mother_education: "👩‍🎓", father_education: "👨‍🎓", studytime: "⏰", 
        attendance: "📊", english: "📖", math: "📐", science: "🔬"
      };
      return icon || icons[name] || "📝";
    };

    return (
      <div className="field-group">
        <label className="field-label">
          <span>{getIcon()}</span> {label}
        </label>
        {options ? (
          <select
            name={name}
            value={form[name]}
            onChange={handleChange}
            className="field-input"
          >
            <option value="">Select {label}...</option>
            {options.map((op) => (
              <option key={op} value={op}>
                {op}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            name={name}
            value={form[name]}
            min={min}
            max={max}
            placeholder={hint || `Enter ${label.toLowerCase()}`}
            onChange={handleChange}
            className="field-input"
          />
        )}
        {hint && <small className="field-hint">{hint}</small>}
      </div>
    );
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>🎓 Student Success Predictor</h1>
        <p className="header-subtitle">AI-powered academic group classification</p>
      </div>

      {/* Auth Section */}
      <div className="auth-card">
        <div className="auth-title">Authentication</div>
        <div className="auth-input-group">
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="auth-input"
            onKeyPress={(e) => e.key === "Enter" && login()}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="auth-input"
            onKeyPress={(e) => e.key === "Enter" && login()}
          />
          <button onClick={register} className="btn btn-primary" disabled={isLoading}>
            {isLoading ? "..." : "Register"}
          </button>
          <button onClick={login} className="btn btn-secondary" disabled={isLoading}>
            {isLoading ? "..." : "Login"}
          </button>
        </div>
        {authMessage.text && (
          <div className={`auth-message ${authMessage.type}`} style={{
            marginTop: "1rem",
            padding: "0.5rem",
            borderRadius: "8px",
            background: authMessage.type === "success" ? "#c6f6d5" : "#fed7d7",
            color: authMessage.type === "success" ? "#22543d" : "#742a2a",
            textAlign: "center"
          }}>
            {authMessage.text}
          </div>
        )}
        {token && (
          <div style={{ marginTop: "0.75rem", fontSize: "0.8rem", color: "#48bb78" }}>
            ✓ Authenticated
          </div>
        )}
      </div>

      {/* Main Form */}
      <div className="form-container">
        <div className="form-grid">
          <Field label="Age" name="age" type="number" min="10" max="25" hint="10-25 years" />
          <Field label="Gender" name="gender" options={["Male", "Female"]} />
          <Field label="Location" name="location" options={["Urban", "Rural", "City"]} />
          <Field label="Family Size" name="family_size" type="number" min="1" max="10" hint="1-10 members" />
          <Field label="Mother Education" name="mother_education" options={["SSC", "HSC", "Diploma", "Honors", "Masters"]} />
          <Field label="Father Education" name="father_education" options={["SSC", "HSC", "Diploma", "Honors", "Masters"]} />
          <Field label="Mother Job" name="mother_job" options={["Yes", "No"]} />
          <Field label="Father Job" name="father_job" options={["Yes", "No"]} />
          <Field label="Guardian" name="guardian" options={["Father", "Mother"]} />
          <Field label="Parental Involvement" name="parental_involvement" options={["Yes", "No"]} />
          <Field label="Internet Access" name="internet_access" options={["Yes", "No"]} />
          <Field label="Study Time" name="studytime" type="number" min="1" max="12" hint="Hours per week" />
          <Field label="Tutoring" name="tutoring" options={["Yes", "No"]} />
          <Field label="School Type" name="school_type" options={["Govt", "Private", "Semi_Govt"]} />
          <Field label="Attendance" name="attendance" type="number" min="0" max="100" hint="Percentage" />
          <Field label="Extra Curricular" name="extra_curricular_activities" options={["Yes", "No"]} />
          <Field label="English Score" name="english" type="number" min="0" max="100" hint="0-100" />
          <Field label="Math Score" name="math" type="number" min="0" max="100" hint="0-100" />
          <Field label="Science Score" name="science" type="number" min="0" max="100" hint="0-100" />
          <Field label="Social Science Score" name="social_science" type="number" min="0" max="100" hint="0-100" />
          <Field label="Art & Culture Score" name="art_culture" type="number" min="0" max="100" hint="0-100" />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem" }}>
        <button onClick={predict} className="predict-btn" disabled={isLoading}>
          {isLoading ? "Processing..." : "🎯 Predict Student Group"}
        </button>
        <button onClick={resetForm} className="btn" style={{
          background: "#e2e8f0",
          color: "#4a5568",
          padding: "1rem 1.5rem"
        }}>
          ↺ Reset
        </button>
      </div>

      {/* Result Section */}
      {result && (
        <div id="result-section" className="result-card">
          <div className="result-label">🎉 PREDICTED GROUP</div>
          <div className="result-value">{result}</div>
          <p style={{ color: "rgba(255,255,255,0.8)", marginTop: "0.75rem", fontSize: "0.85rem" }}>
            Based on academic performance and personal factors
          </p>
        </div>
      )}
    </div>
  );
}