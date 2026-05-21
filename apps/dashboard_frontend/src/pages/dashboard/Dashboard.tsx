import AxiosInstance from "@/api/axiosInstance";
import { DashboardHeader } from "@/components/dashboard";
import {
  StatCard,
  AnalyticsCard,
  ReminderCard,
  ProjectListCard,
  TeamCard,
  ProgressCard,
  TimeTrackerCard,
} from "@/components/dashboard/cards";
import {
  statsData,
  analyticsData,
  teamData,
  projectsData,
  reminderData,
  progressLegendData,
} from "@/data/dashboard.data";
import { useEffect } from "react";

const Dashboard = () => {
  const handleAddProject = () => {
    console.log("Add project clicked");
  };

  const handleImportData = () => {
    console.log("Import data clicked");
  };

  const handleAddMember = () => {
    console.log("Add member clicked");
  };

  const handleNewProject = () => {
    console.log("New project clicked");
  };

  const handleStartMeeting = () => {
    console.log("Start meeting clicked");
  };

  const handleTimeStop = (totalSeconds: number) => {
    console.log("Time tracked:", totalSeconds, "seconds");
  };


  const testApiCall = async () => {
    try {
      
      const res= await AxiosInstance.get("/auth/me");
      console.log("API Response:", res.data);
    } catch (error) {
      console.log("API Error:", error);
    }
  }
useEffect(() => {
  testApiCall();
}, []);

  return (
    <>
      <div className="p-3 sm:p-4 md:p-6 lg:p-8 bg-muted rounded-2xl sm:rounded-3xl">
        <DashboardHeader
          title="Dashboard"
          subtitle="Plan, prioritize, and accomplish your tasks with ease."
          onAddProject={handleAddProject}
          onImportData={handleImportData}
        />

        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-5">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        <div className="flex flex-col xl:flex-row w-full gap-3 sm:gap-4">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 order-2 xl:order-1">
            <div className="sm:col-span-2 lg:col-span-1">
              <AnalyticsCard data={analyticsData} />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <ReminderCard reminder={reminderData} onAction={handleStartMeeting} />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <TeamCard members={teamData} onAddMember={handleAddMember} />
            </div>

            <div className="sm:col-span-2 lg:col-span-1">
              <ProgressCard percentage={81} legends={progressLegendData} />
            </div>
          </div>

     
          <div className="w-full xl:w-[320px] 2xl:w-85 flex flex-col gap-3 sm:gap-4 order-1 xl:order-2 shrink-0">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3 sm:gap-4">
              <ProjectListCard
                projects={projectsData}
                onAddNew={handleNewProject}
              />
              <TimeTrackerCard
                initialSeconds={7048}
                autoStart={true}
                onStop={handleTimeStop}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;