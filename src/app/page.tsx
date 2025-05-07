"use client";

import { useState, useEffect, useRef } from 'react';
import { FaQuestionCircle, FaBell, FaRegUserCircle, FaSlidersH, FaUpload, FaExternalLinkAlt, FaFileDownload, FaEdit, FaRegCopy, FaKeyboard, FaAngleDoubleRight } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import React from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInputModalOpen, setIsInputModalOpen] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);

  const [formData, setFormData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      linkedIn: '',
      location: '',
    },
    jobInfo: {
      jobTitle: '',
      companyName: '',
      companyLocation: '',
      jobDescription: '',
      applicationDeadline: '',
    },
    professionalBackground: {
      jobTitle: '',
      company: '',
      workExperience: '',
      skills: '',
      yearsExperience: '',
      achievements: '',
    },
    education: {
      degree: '',
      institution: '',
      coursework: '',
    },
    motivation: {
      whyJob: '',
      whyCompany: '',
      careerGoals: '',
      softSkills: '',
      tone: '',
    },
    preferences: {
      referral: '',
      keywords: '',
      closingStatement: '',
      length: '',
    },
  });

  const handleInputChange = (section: string, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...(prev[section as keyof typeof formData]),
        [field]: value,
      },
    }));
  };

  const generatePayload = () => {
    const payload: { [key: string]: any } = {};
    Object.keys(formData).forEach((section) => {
      const sectionData = formData[section as keyof typeof formData];
      const filteredData = Object.fromEntries(
        Object.entries(sectionData).filter(([_, value]) => value.trim() !== '')
      );
      if (Object.keys(filteredData).length > 0) {
        payload[section] = filteredData;
      }
    });
    return payload;
  };


  const handleGenerate = async () => {
    const payload = generatePayload();
  
    if (Object.keys(payload).length === 0) {
      toast.error('Please fill in at least one field before generating.');
      return;
    }
  
    // Convert payload to a single string (paragraph)
    const prompt = Object.entries(payload)
      .map(([section, fields]) => {
        const sectionText = Object.entries(fields)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, ' $1')}: ${value}`)
          .join('. ');
        return `${section.replace(/([A-Z])/g, ' $1')}: ${sectionText}`;
      })
      .join('. ');
      console.log('Generated Prompt:', prompt); 
     
      setLoading(true);
      setResult('');
      const toastId = toast.loading("Generating...");
      
      try {
        console.log("Prompt to generate (MANUAL INPUT):", prompt); 
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt }),
        });

        console.log("Payload sent to API (handleGenerate):", { prompt });
        const data = await res.json();
        setResult(data.result);
        setIsModalOpen(true);
        toast.update(toastId, { render: "Generation complete!", type: "success", isLoading: false, autoClose: 3000 });
      } catch (error) {
        console.error("Error generating response:", error);
        toast.update(toastId, { render: "An error occurred while generating.", type: "error", isLoading: false, autoClose: 3000 });
      } finally {
        setLoading(false);
        setIsInputModalOpen(false); 
      }
  };

  const phrases = ['AI Cover Letter Generator', 'Create Your Perfect Cover Letter'];
  const typingSpeed = 100;
  const delayBetweenPhrases = 2000; 
  const textRef = useRef(''); 
  const [text, setText] = useState('');

  useEffect(() => {
    let currentPhraseIndex = 0;
    let currentCharIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[currentPhraseIndex];

      if (!isDeleting) {
        // Typing logic
        textRef.current = textRef.current + currentPhrase[currentCharIndex];
        setText(textRef.current);
        currentCharIndex++;

        if (currentCharIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, delayBetweenPhrases); 
          return;
        }
      } else {
        // Deleting logic
        textRef.current = textRef.current.slice(0, -1);
        setText(textRef.current);

        if (textRef.current.length === 0) {
          isDeleting = false;
          currentCharIndex = 0;
          currentPhraseIndex = (currentPhraseIndex + 1) % phrases.length;
        }
      }

      setTimeout(type, isDeleting ? typingSpeed / 2 : typingSpeed);
    };

    type();
  }, []);

  const generate = async () => {
    console.log("Prompt to generate:", prompt);
    if (!prompt.trim()) {
      toast.error("Please enter a prompt.");
      return;
    }
    if (prompt.length < 10) {
      toast.error("Prompt must be at least 10 characters long.");
      return;
    }

    setLoading(true);
    setResult('');
    const toastId = toast.loading("Generating...");

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setResult(data.result);
      setIsModalOpen(true);
      toast.update(toastId, { render: "Generation complete!", type: "success", isLoading: false, autoClose: 3000 });
    } catch (error) {
      console.error("Error generating response:", error);
      toast.update(toastId, { render: "An error occurred while generating.", type: "error", isLoading: false, autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (type: string) => {
    setShowDownloadOptions(false);
    switch (type) {
      case 'pdf':
        console.log('Downloading as PDF...');
        break;
      case 'word':
        console.log('Downloading as Word...');
        break;
      case 'image':
        console.log('Downloading as Image...');
        break;
      default:
        console.error('Unknown download type');
    }
  };

  function setShowDownloadOptions(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

  return (
    <main className="p-5 md:p-40 h-screen">
      {/* NAV */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-[#fff] rounded-[100px] p-2 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-4 w-full md:w-[200px] cursor-pointer">
          <img src="/logo.png" alt="Logo" className="hidden sm:block w-10 h-10 md:w-15 md:h-15" />
          <h1 className="hidden sm:block md:text-3xl sm:text-xl font-bold text-[#272727]">CoverLetter.AI</h1>
        </div>
        {/* Navigation Links */}
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 w-full md:w-[200px]">
          <a className="text-[#272727] font-bold" href="#">Overview</a>
          <a className="text-[#272727]" href="#">Tools</a>
          <a className="text-[#272727]" href="#">Pricing</a>
        </div>
        {/* User Profile */}
        <div className="flex justify-center md:justify-end items-center gap-4 w-full md:w-[200px] cursor-pointer">
          <FaQuestionCircle className="text-[#272727] w-5 h-5 md:w-6 md:h-6" />
          <FaBell className="text-[#272727] w-5 h-5 md:w-6 md:h-6" />
          <FaRegUserCircle className="text-[#272727] w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>

      {/* Title */}
      <div className="flex items-center mb-10 w-full justify-center flex-col gap-10">
        <img src="/logo.png" alt="Logo" className="w-30 h-30" />
        <h1 className="text-5xl text-center md:text-6xl font-bold text-[#B68F40]">
          {text}
          <span className="blinking-cursor">|</span>
        </h1>
      </div>

      {/* Prompting */}
      <div className="flex mb-10 md:items-center md:justify-center flex-col md:flex-row gap-10">
        <div className="flex items-center flex-row">
          <div className="max-w-3xl">
            <input
              placeholder="Enter job title, company, etc..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="border-1 border-[#D7FCD4] rounded-tr-none rounded-br-none rounded-lg p-4 px-6 md:w-lg lg:w-2xl resize-none pl-10"
            />
          </div>
          <div className="border-l-0 border-1  p-4 border-[#D7FCD4] rounded-lg rounded-tl-none rounded-bl-none cursor-pointer">
            <FaSlidersH
              className="w-6 h-6 text-[#fff] cursor-pointer hover:text-[#B68F40] transition duration-300"
              onClick={() => setShowOptions(!showOptions)}
            />
          </div>
        </div>
        <button
          onClick={generate}
          disabled={loading}
          className="bg-[#B68F40] text-white font-bold py-4 px-6 rounded-lg hover:bg-[#A77B3D] transition duration-300 cursor-pointer"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
      {/* Options Section */}
      <div className="w-full flex items-center justify-center flex-col ">
        <div className={`flex mb-10 p-10 w-1/2 justify-center flex-col gap-2 transition-all duration-300 border-1 bg-[#FFF8F0]    rounded-lg ${showOptions ? 'opacity-100 max-h-[300px]' : 'opacity-0 max-h-0 overflow-hidden'}`}>
          <div className="flex gap-2 ">
            <div className=" bg-[#30011E] rounded-[100px]  p-4  ">
              <FaKeyboard className="text-[#D7FCD4] w-5 h-5" />
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <div className="div">
                <h1 className=" text-[#30011E] font-bold"> Manual Input</h1>
                <p className="text-sm text-[#30011E] italic"> Enter job title, company, etc... </p>
              </div>
              <div>
                <button className="bg-[#832161] border-0 border-[#30011E] rounded-[100px] p-2 hover:bg-[#484848] transition duration-300 cursor-pointer ">
                  <FaAngleDoubleRight className="text-[#fff] w-5 h-5" onClick={() => setIsInputModalOpen(true)} />
                </button>
              </div>
            </div>
          </div>
          <hr className="border-1 border-[#30011E] w-full" />

          <div className="flex gap-2">
            <div className=" bg-[#30011E] rounded-[100px]  p-4  ">
              <FaUpload className="text-[#D7FCD4] w-5 h-5" />
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <div className="div">
                <h1 className=" text-[#30011E] font-bold"> Upload Resume</h1>
                <p className="text-sm text-[#30011E] italic"> Upload your resume for better results </p>
              </div>
              <div>
                <button className="bg-[#832161] border-0 border-[#30011E] rounded-[100px] p-2 hover:bg-[#484848] transition duration-300 cursor-pointer ">
                  <FaAngleDoubleRight className="text-[#ffff] w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
          <hr className="border-1 border-[#30011E] w-full" />

          <div className="flex gap-2">
            <div className=" bg-[#30011E] rounded-[100px]  p-4  ">
              <FaExternalLinkAlt className="text-[#D7FCD4] w-5 h-5" />
            </div>
            <div className="flex justify-between items-center gap-2 w-full">
              <div className="div">
                <h1 className=" text-[#30011E] font-bold"> Input</h1>
                <p className="text-sm text-[#30011E] italic"> Input Job Posting Link for better results </p>
              </div>
              <div></div>
                <button className="bg-[#832161] border-0 border-[#30011E] rounded-[100px] p-2 hover:bg-[#484848] transition duration-300 cursor-pointer ">
                  <FaAngleDoubleRight className="text-[#fff] w-5 h-5" />
                </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-opacity-50 backdrop-blur-md flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6  w-1/2 h-3/4 overflow-y-auto">
            <h2 className="text-4xl font-bold text-center mb-4 text-[#272727]">Generated Result</h2>
            <hr className="mb-4"></hr>
            <div style={{ whiteSpace: 'pre-wrap' }} className="text-[#272727]">
              {result}
            </div>
            <div className="flex items-center justify-between mt-4 ">
              <div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-[#B68F40] cursor-pointer text-white font-bold py-2 px-4 rounded-lg hover:bg-[#A77B3D] transition duration-300"
                >
                  Close
                </button>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="items-center bg-[#30011E] w-10 h-10 justify-center flex cursor-pointer rounded-full hover:bg-[#484848] transition duration-300"

                >
                  <FaFileDownload className="text-[#fff] w-5 h-5" />
                </div>
                <div
                  className="items-center bg-[#30011E] w-10 h-10 justify-center flex cursor-pointer rounded-full hover:bg-[#484848] transition duration-300"
                >
                  <FaEdit className="text-[#fff] w-5 h-5" />
                </div>
                <div
                  className="items-center bg-[#30011E] w-10 h-10 justify-center flex cursor-pointer rounded-full hover:bg-[#484848] transition duration-300"
                >
                  <FaRegCopy className="text-[#fff] w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isInputModalOpen && (
        <Popup open={isInputModalOpen} onClose={() => setIsInputModalOpen(false)} modal nested>
          <div className="bg-white rounded-lg p-6 overflow-y-scroll h-[65vh]">
            <h2 className="text-4xl font-bold text-center mb-4 text-[#272727]">Manual Input</h2>
            <hr className="mb-4"></hr>

            {/* Step Indicator */}
            <div className="flex justify-center mb-4 text-xl">
              {['Personal Info', 'Job Info', 'Professional Background', 'Education', 'Motivation & Fit', 'Preferences', 'Summary'].map((step, index) => (
                <div
                  key={index}
                  onClick={() => setCurrentStep(index)} // Make step indicators clickable
                  className={`flex items-center justify-center w-3 h-3 rounded-full cursor-pointer ${
                    currentStep === index ? 'bg-[#B68F40] text-white' : 'bg-gray-300 text-gray-700'
                  } mx-2 transition duration-300`}
                  title={step} // Add a tooltip for better UX
                >

                </div>
              ))}
            </div>

            {/* Panels */}
            {currentStep === 0 && (
              <div>
                <p className="text-[#272727] mb-4">Personal Information:</p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="input-field"
                    value={formData.personalInfo.fullName}
                    onChange={(e) => handleInputChange('personalInfo', 'fullName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Email Address"
                    className="input-field"
                    value={formData.personalInfo.email}
                    onChange={(e) => handleInputChange('personalInfo', 'email', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="input-field"
                    value={formData.personalInfo.phone}
                    onChange={(e) => handleInputChange('personalInfo', 'phone', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="LinkedIn URL (optional)"
                    className="input-field"
                    value={formData.personalInfo.linkedIn}
                    onChange={(e) => handleInputChange('personalInfo', 'linkedIn', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location (optional)"
                    className="input-field"
                    value={formData.personalInfo.location}
                    onChange={(e) => handleInputChange('personalInfo', 'location', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div>
                <p className="text-[#272727] mb-4">Job Information:</p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Job Title Applying For"
                    className="input-field"
                    value={formData.jobInfo.jobTitle}
                    onChange={(e) => handleInputChange('jobInfo', 'jobTitle', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company Name"
                    className="input-field"
                    value={formData.jobInfo.companyName}
                    onChange={(e) => handleInputChange('jobInfo', 'companyName', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Company Location (City, State/Country)"
                    className="input-field"
                    value={formData.jobInfo.companyLocation}
                    onChange={(e) => handleInputChange('jobInfo', 'companyLocation', e.target.value)}
                  />
                  <textarea
                    placeholder="Job Description"
                    className="input-field"
                    rows={4}
                    value={formData.jobInfo.jobDescription}
                    onChange={(e) => handleInputChange('jobInfo', 'jobDescription', e.target.value)}
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Job Application Deadline (optional)"
                    className="input-field"
                    value={formData.jobInfo.applicationDeadline}
                    onChange={(e) => handleInputChange('jobInfo', 'applicationDeadline', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <p className="text-[#272727] mb-4">Applicant’s Professional Background:</p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Current or Most Recent Job Title"
                    className="input-field"
                    value={formData.professionalBackground.jobTitle}
                    onChange={(e) => handleInputChange('professionalBackground', 'jobTitle', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Current/Most Recent Company"
                    className="input-field"
                    value={formData.professionalBackground.company}
                    onChange={(e) => handleInputChange('professionalBackground', 'company', e.target.value)}
                  />
                  <textarea
                    placeholder="Summary of Relevant Work Experience"
                    className="input-field"
                    rows={4}
                    value={formData.professionalBackground.workExperience}
                    onChange={(e) => handleInputChange('professionalBackground', 'workExperience', e.target.value)}
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Key Skills and Technologies"
                    className="input-field"
                    value={formData.professionalBackground.skills}
                    onChange={(e) => handleInputChange('professionalBackground', 'skills', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Years of Experience in Relevant Fields"
                    className="input-field"
                    value={formData.professionalBackground.yearsExperience}
                    onChange={(e) => handleInputChange('professionalBackground', 'yearsExperience', e.target.value)}
                  />
                  <textarea
                    placeholder="Major Achievements"
                    className="input-field"
                    rows={4}
                    value={formData.professionalBackground.achievements}
                    onChange={(e) => handleInputChange('professionalBackground', 'achievements', e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <p className="text-[#272727] mb-4">Education Background:</p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Highest Degree Earned"
                    className="input-field"
                    value={formData.education.degree}
                    onChange={(e) => handleInputChange('education', 'degree', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Institution Name"
                    className="input-field"
                    value={formData.education.institution}
                    onChange={(e) => handleInputChange('education', 'institution', e.target.value)}
                  />
                  <textarea
                    placeholder="Relevant Coursework or Projects"
                    className="input-field"
                    rows={4}
                    value={formData.education.coursework}
                    onChange={(e) => handleInputChange('education', 'coursework', e.target.value)}
                  ></textarea>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <p className="text-[#272727] mb-4">Motivation and Fit:</p>
                <div className="flex flex-col gap-4">
                  <textarea
                    placeholder="Why Do You Want This Job?"
                    className="input-field"
                    rows={4}
                    value={formData.motivation.whyJob}
                    onChange={(e) => handleInputChange('motivation', 'whyJob', e.target.value)}
                  ></textarea>
                  <textarea
                    placeholder="Why This Company?"
                    className="input-field"
                    rows={4}
                    value={formData.motivation.whyCompany}
                    onChange={(e) => handleInputChange('motivation', 'whyCompany', e.target.value)}
                  ></textarea>
                  <textarea
                    placeholder="Career Goals / How This Role Aligns with Your Goals"
                    className="input-field"
                    rows={4}
                    value={formData.motivation.careerGoals}
                    onChange={(e) => handleInputChange('motivation', 'careerGoals', e.target.value)}
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Soft Skills or Personality Traits to Highlight"
                    className="input-field"
                    value={formData.motivation.softSkills}
                    onChange={(e) => handleInputChange('motivation', 'softSkills', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Preferred Tone"
                    className="input-field"
                    value={formData.motivation.tone}
                    onChange={(e) => handleInputChange('motivation', 'tone', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div>
                <p className="text-[#272727] mb-4">Customization & Preferences:</p>
                <div className="flex flex-col gap-4">
                  <input
                    type="text"
                    placeholder="Mention a Referral or Contact at the Company (optional)"
                    className="input-field"
                    value={formData.preferences.referral}
                    onChange={(e) => handleInputChange('preferences', 'referral', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Specific Keywords or Phrases to Include"
                    className="input-field"
                    value={formData.preferences.keywords}
                    onChange={(e) => handleInputChange('preferences', 'keywords', e.target.value)}
                  />
                  <textarea
                    placeholder="Optional Closing Statement or 'Call to Action'"
                    className="input-field"
                    rows={4}
                    value={formData.preferences.closingStatement}
                    onChange={(e) => handleInputChange('preferences', 'closingStatement', e.target.value)}
                  ></textarea>
                  <input
                    type="text"
                    placeholder="Desired Length (Short, Standard, Long)"
                    className="input-field"
                    value={formData.preferences.length}
                    onChange={(e) => handleInputChange('preferences', 'length', e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentStep === 6 && (
              <div>
                <p className="text-[#272727] mb-4">Summary:</p>
                <div className="flex flex-col gap-4 h-[40vh] overflow-y-auto">
                  {Object.keys(formData).map((section) => {
                    const sectionData = formData[section as keyof typeof formData];
                    const filteredData = Object.entries(sectionData).filter(([_, value]) => value.trim() !== '');
                    if (filteredData.length === 0) return null;
                    return (
                      <div key={section} className="mb-4">
                        <h3 className="text-lg font-bold text-[#272727] capitalize">{section.replace(/([A-Z])/g, ' $1')}</h3>
                        <ul className="list-disc pl-5">
                          {filteredData.map(([key, value]) => (
                            <li key={key} className="text-[#272727]">
                              <strong>{key.replace(/([A-Z])/g, ' $1')}: </strong>
                              {value}
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-end gap-4 items-center mt-4">
              <button
                onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                className="bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-300"
                disabled={currentStep === 0}
              >
                Back
              </button>
              {currentStep < 6 ? (
                <button
                  onClick={() => setCurrentStep((prev) => Math.min(prev + 1, 6))}
                  className="bg-[#B68F40] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#A77B3D] transition duration-300"
                >
                  Next
                </button>
              ) : null}
              {currentStep === 6 && (
                <button
                  onClick={handleGenerate}
                  className="bg-[#B68F40] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#A77B3D] transition duration-300"
                >
                  Generate
                </button>
              )}
            </div>
          </div>
        </Popup>
      )}

      {result && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#B68F40] text-white font-bold py-2 px-4 rounded-lg hover:bg-[#A77B3D] transition duration-300 mb-10"
          >
            View Generated Result
          </button>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={5000}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </main>
  );
}
function setShowDownloadOptions(arg0: boolean) {
  throw new Error('Function not implemented.');
}

