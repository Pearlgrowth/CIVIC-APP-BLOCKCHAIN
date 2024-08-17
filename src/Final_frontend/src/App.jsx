import React, { useEffect, useState } from "react";
import './index.scss'
import { Actor, HttpAgent } from "@dfinity/agent";
import { idlFactory as CivicChainIDL } from "../../declarations/Final_backend";
const agent = new HttpAgent({
  host: "http://localhost:3000",
});
agent.fetchRootKey();
const civicChain = Actor.createActor(CivicChainIDL, {
  agent,
  canisterId: "bkyz2-fmaaa-aaaaa-qaaaq-cai", // Replace with your backend canister ID
});

function App() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(0);
  const [milestones, setMilestones] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      const projList = await civicChain.getProjects();
      setProjects(projList);
    }
    fetchProjects();
  }, []);

  const addProject = async () => {
    const projMilestones = milestones.split(",");
    await civicChain.addProject(name, Number(budget), projMilestones);
    const projList = await civicChain.getProjects();
    setProjects(projList);
  };

  return (
    <div className="App">
      <h1>CivicChain</h1>
      <div>
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Budget"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
        />
        <input
          type="text"
          placeholder="Milestones (comma separated)"
          value={milestones}
          onChange={(e) => setMilestones(e.target.value)}
        />
        {/* Milestones: These are significant goals or checkpoints within a project. In the code, milestones are entered as a comma-separated string, which is then split into an array. Each milestone represents a key step in the project's progress. For example, if you're building a community center, milestones could be "Foundation Laid, Roof Installed, Painting Completed." */}
        <button onClick={addProject}> <p className = "projo">  Add Project</p></button>
      </div>

      <h2>Projects Added</h2>
      <ul>
  {projects.map((proj, index) => (
    <li key={index}>
      <h3>{proj.name}</h3>
      <p>Budget: {proj.budget.toString()}</p> {/* Convert BigInt to string for display */}
      <p>Start Date: {new Date(Number(proj.startDate / 1000000n)).toLocaleString()}</p>
      <p>End Date: {new Date(Number(proj.endDate / 1000000n)).toLocaleString()}</p>
      <p>Milestones: {proj.milestones.join(", ")}</p>
      <p>Completed Milestones: {proj.completedMilestones.join(", ")}</p>
      <p>Funds Disbursed: {proj.fundsDisbursed.toString()}</p> {/* Convert BigInt to string for display */}
    </li>
  ))}
</ul>
    </div>
  );
}

export default App;
