import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { JobDetail } from "@/app/components/JobDetail/JobDetail";
import { Loader, Center, Text, Button } from "@mantine/core";

interface JobAd {
  id: string;
  title: string;
  description: string;
  salary: string;
  startDate: string;
  applicationDeadline: string;
  duration: string;
  location: string;
  skills?: string[];
  qualifications?: string[];
}

export function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState<JobAd | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = "your-hardcoded-jwt-token-here"; // 🔐 Replace later

  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/job/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Fetched job:", response.data); // ✅ This is the key line

        setJob(response.data);
        setError(null);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load job details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchJob();
  }, [id]);

  if (loading) {
    return (
      <Center mt="xl">
        <Loader />
      </Center>
    );
  }

  if (error) {
    return (
      <Center mt="xl" style={{ flexDirection: "column" }}>
        <Text color="red" mb="sm">
          {error}
        </Text>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Center>
    );
  }

  if (!job) return null;

  return (
    <div className="jobDetailPageWrapper">
      <JobDetail job={job} />
    </div>
  );
}
