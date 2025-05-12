import React, { useEffect, useState, useParams} from 'react';
import activity1 from "../assets/img/activity1.png";
import { Link } from 'react-router-dom';
import Guest from '../layouts/Guest';

const ProjectDetails = () => {

    // const { id } = useParams();
    // const [project, setProject] = useState({});
    

    // const fetchProject = async () => {
    //     try {
    //         const response = await fetch(`https://api.example.com/projects/${id}`);
    //         const data = await response.json();
    //         setProject(data);
    //     } catch (error) {
    //         console.error("Error fetching project:", error);
    //     }
    // }

    const project ={
            "id": 1,
            "title": "Gabay at Ginhawa: Women’s Health Fair",
            "date": "2025-03-08",
            "location": "Barangay Malusak, Sta. Rosa, Laguna",
            "description": "The Women’s Health Fair aims to provide accessible healthcare services to mothers, grandmothers, and young women in underprivileged communities. The event offers free medical consultations, breast and cervical cancer screenings, mental health checkups, and health education seminars. Local doctors, nurses, and volunteer health workers collaborate to address the unique health needs of women. Informational booths and wellness corners offer guidance on nutrition, reproductive health, and self-care practices. By bringing these services directly to the barangay, the project encourages early diagnosis and proactive care, ultimately improving the overall wellbeing of women who often place their own health last.",
            "tags": ["health", "wellness", "women empowerment"],
            "image": activity1
        }

    return (
        <Guest>
            <div className="w-screen bg-white pt-20">
                <div className='max-w-[1200px] mx-auto flex flex-col gap-4 p-4'>
                    <div>
                        <Link to="/" className='text-xs '>Back</Link>
                    </div>
                    <div>
                        <img src={project.image} alt="img" className="w-full h-[600px]" />
                    </div>
                    <div className='flex flex-col gap-4'>
                        <h1 className="text-xl font-semibold text-orange-600">{project.title}</h1>
                        <p className="text-sm text-justify">{project.description}</p>
                    </div>
                </div>
            </div>
        </Guest>
    );
}

export default ProjectDetails; 