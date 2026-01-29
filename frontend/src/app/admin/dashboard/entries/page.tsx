/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import React ,{useEffect,useState} from 'react';
import * as XLSX from 'xlsx';
import axios from '@/utils/axios';
const Page=()=>{
    const [participants,setParticipant]=useState<any>([]);
    const formatTime=(timeInSeconds:number):string=>{
      return`${timeInSeconds.toFixed(3)} sec`;
    };
    useEffect(()=>{
        const fetchResults=async()=>{
            try{
                const response=await axios.get('/admin/results');
                const participants=response.data.results;
                const sortedParticipants=participants.sort((a:any,b:any)=>{
                    if(b.score===a.score){
                        return a.finishTime-b.finishTime;
                    }
                    return b.score-a.score;
                });
                setParticipant([...sortedParticipants]);
            }catch(error){
                console.error('Error fetching results:',error);
            }
        };
        fetchResults();
    },[]);
    const downloadExcel=()=>{
        const formattedparticipants=participants.map((student:any,index:any)=>({
            position:`${index+1}${getRankSuffix(index+1)}`,
            ...student,
            finishTime:formatTime(student.finishTime)
        }));
        const worksheet=XLSX.utils.json_to_sheet(formattedparticipants);
        const workbook=XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook,worksheet,'Student Scores');
    };
    const getRankSuffix =(index:any)=>{
        const suffixes=["th","st","nd","rd"];
        const mod100=index%100;
        return suffixes[(mod100-20)%10]||suffixes[mod100]||suffixes[0];
    };
    return (
  <div className="min-w-full">
    <section className="flex items-center justify-center py-8">
      <div className="container px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-gray-800">Student Scores</h2>
          <button onClick={downloadExcel}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300">
              Download Excel
            
          </button>
        </div>

        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 text-left">Position</th>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-right">Score</th>
                <th className="px-4 py-2 text-right">Finish Time</th>
              </tr>
            </thead>
            <tbody>
              {participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-4 text-gray-500">
                    No participants found
                  </td>
                </tr>
              ) : (
                participants.map((student: any, index: any) => (
                  <tr key={index} className="bg-gray-100 even:bg-gray-200">
                    <td className="px-4 py-2 border text-left">
                      {index + 1}
                      {getRankSuffix(index + 1)}
                    </td>
                    <td className="px-4 py-2 border">{student.participantName}</td>
                    <td className="px-4 py-2 border">{student.participantEmail}</td>
                    <td className="px-4 py-2 border text-right">{student.score}</td>
                    <td className="px-4 py-2 border text-right">
                      {formatTime(student.finishTime)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </div>
);

} ;
export default Page;