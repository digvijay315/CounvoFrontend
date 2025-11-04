import React from "react";
import { useRef,useState,useEffect } from "react";
import '../css/OnlineLawyerConsultation.css'; // Uncomment after you add the CSS
import Header from './Layout/header';
import Footer from "./Layout/footer";
import socket from './socket';
import Swal from 'sweetalert2';
import api from '../api';
import { HiOutlinePaperClip } from 'react-icons/hi';
import { IoSend } from 'react-icons/io5';
import { FaRegCommentDots } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import CustomerFeedbackForm from "./customerfeedback";


const Home = () => {

  const navigate=useNavigate()

  const coverCards = [
  { title: "Legal Notices", img: "https://assets.vakilsearch.com/consult_legal_notices.svg" },
  { title: "Company Law Matters", img: "https://assets.vakilsearch.com/consult_company.svg" },
  { title: "Legal Documentation", img: "https://assets.vakilsearch.com/consult_legal_documentation.svg" },
  { title: "Others", img: "https://assets.vakilsearch.com/consult_others.svg" },
  { title: "Property Lawyer", img: "https://assets.vakilsearch.com/consult_property.svg" },
  { title: "Family Lawyer", img: "https://assets.vakilsearch.com/consult_family.svg" },
  { title: "Consumer Lawyer", img: "https://assets.vakilsearch.com/consult_consumer.svg" },
  { title: "Civil Lawyer", img: "https://assets.vakilsearch.com/consult_civil.svg" },
  { title: "Criminal Lawyer", img: "https://assets.vakilsearch.com/consult_criminal.svg" },
  { title: "IP Lawyer", img: "https://assets.vakilsearch.com/consult_ip.svg" },
  { title: "Labour Lawyer", img: "https://assets.vakilsearch.com/consult_labour.svg" },
  { title: "Constitutional Lawyer", img: "https://assets.vakilsearch.com/consult_constitutional.svg" },
];

const CARDS_PER_PAGE = 4;


  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(coverCards.length / CARDS_PER_PAGE);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 0));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages - 1));

  const start = page * CARDS_PER_PAGE;
  const visibleCards = coverCards.slice(start, start + CARDS_PER_PAGE);

const consultants = [
  {
    name: "SJ Anakha",
    img: "https://assets.vakilsearch.com/live-images/ttl/authors-anakha.svg",
    desc: "Solves cheque bounce, money recovery & DRT cases.",
    experience: "5 years of Experience",
  },
  {
    name: "Kanisha",
    img: "https://assets.vakilsearch.com/live-images/ttl/authors-kanisha.svg",
    desc: "Handles succession, registration, verification of property efficiently.",
    experience: "3 years of Experience",
  },
  {
    name: "Srijita",
    img: "https://assets.vakilsearch.com/live-images/ttl/authors-srijitha.svg",
    desc: "Handles accident claims, employment issues, consumer complaints.",
    experience: "8 years of Experience",
  },
  {
    name: "Kavitha Natesan",
    img: "https://assets.vakilsearch.com/live-images/ttl/kavitha-natesan.svg",
    desc: "Cheque Bounce, GST Consultant",
    experience: "12 years of Experience",
  },
];

const CARDS_PER_PAGE1 = 3;
  const [page1, setPage1] = useState(0);
  const totalPages1 = Math.ceil(consultants.length / CARDS_PER_PAGE1);

  const handlePrev1 = () => setPage1((p) => Math.max(p - 1, 0));
  const handleNext1 = () => setPage1((p) => Math.min(p + 1, totalPages - 1));

  const start1 = page1 * CARDS_PER_PAGE1;
  const visibleConsultants = consultants.slice(start1, start1 + CARDS_PER_PAGE1);


  const legalPoints = [
  {
    title: "Expert Guidance:",
    desc: " A lawyer understands the law and can guide you through complex legal processes.",
  },
  {
    title: "Right Representation:",
    desc: "Whether you're facing a dispute, sending/receiving a legal notice, or filing a complaint — a lawyer ensures your rights are protected. ",
  },
  {
    title: "Risk Reduction:",
    desc: "Avoid costly mistakes or penalties by having a professional represent you. ",
  },
  {
    title: "Peace of Mind:",
    desc: " Knowing you have someone experienced handling your legal matter helps reduce stress. ",
  },
  {
    title: "Better Negotiation:",
    desc: " Lawyers can communicate formally and effectively, often leading to better outcomes.",
  },
 
];


const legalExpertise = [
  {
    title: "Criminal Case ",
    img: "https://assets.vakilsearch.com/consult_civil.svg",
    alt: "Family Lawyer",
    link: "https://www.zolvit.com/lawyers/family",
    description:
      `Criminal cases involve actions that are considered offenses against society or the 
state. These include crimes like theft, assault, fraud, murder, cybercrime, and more. 
A criminal lawyer defends individuals accused of such crimes or helps victims file 
complaints and pursue justice under the Indian Penal Code (IPC). `,
  },
  {
    title: "Civil Case",
    img: "https://assets.vakilsearch.com/consult_property.svg",
    alt: "Property Lawyer",
    link: "https://www.zolvit.com/lawyers/property",
    description:
      `Civil cases deal with personal disputes between individuals or organizations. 
Common civil matters include property disputes, breach of contract, loan recovery, 
defamation, and more. Civil lawyers help in filing suits, sending legal notices, and 
court representation.`
  },
  {
    title: "Family Case",
    img: "https://assets.vakilsearch.com/consult_family.svg",
    alt: "Civil Lawyer",
    link: "https://www.zolvit.com/lawyers/civil",
    description:
     `Family cases include legal issues related to personal relationships such as marriage, 
divorce, child custody, maintenance, domestic violence, and inheritance. A family 
lawyer helps resolve these matters through court or mutual agreement. `
  },
  {
    title: "Corporate Case",
    img: "https://assets.vakilsearch.com/consult_company.svg",
    alt: "Business Lawyer",
    link: "https://www.zolvit.com/lawyers/business",
    description:
      `Corporate legal cases involve legal matters related to companies and business 
operations. This includes company registration, mergers, shareholder disputes, 
regulatory compliance, and corporate fraud. Corporate lawyers work with businesses 
of all sizes.`
  },
  {
    title: "Consumer Case",
    img: "https://assets.vakilsearch.com/consult_criminal.svg",
    alt: "Criminal Lawyer",
    link: "https://www.zolvit.com/lawyers/criminal",
    description:
     `Consumer cases are filed when a consumer faces fraud, poor service, or defective 
products. A consumer lawyer helps you file a complaint in the consumer court and 
ensures your consumer rights are protected.`
  },
  {
    title: "Labour Case",
    img: "https://assets.vakilsearch.com/consult_labour.svg",
    alt: "Consumer Lawyer",
    link: "https://www.zolvit.com/lawyers/consumer",
    description:
    ` Labour or employment cases deal with disputes between employers and employees. 
This includes wrongful termination, unpaid wages, harassment at work, and labor law 
violations. Labour lawyers ensure your rights at the workplace are legally protected.`,
  },
  {
    title: "Cyber Case",
    img: "https://assets.vakilsearch.com/consult_consumer.svg",
    alt: "Labour Lawyer",
    link: "https://www.zolvit.com/lawyers/labour",
    description:
     `Cyber legal cases involve crimes committed using the internet or digital platforms. 
Common examples include online fraud, cyberbullying, hacking, financial scams, 
identity theft, and data breaches. A cyber lawyer helps file complaints and take legal 
action under the IT Act.`
  },
  {
    title: "Property Case",
    img: "https://assets.vakilsearch.com/consult_constitutional.svg",
    alt: "Constitutional Lawyer",
    link: "https://www.zolvit.com/lawyers/constitutional",
    description:
  ` Property cases include land disputes, illegal possession, boundary issues, ancestral 
property conflicts, and builder fraud. A property lawyer helps in title verification, 
property transfer, and litigation.`
  },
  {
    title: "Tax Case",
    img: "https://assets.vakilsearch.com/consult_ip.svg",
    alt: "Intellectual Property (IP) Lawyer",
    link: "https://www.zolvit.com/lawyers/intellectual-property",
    description:
     `Tax cases involve issues with income tax, GST, business tax disputes, or notices 
from tax authorities. A tax lawyer or consultant helps with tax filing, appeals, audits, 
and notices from the Income Tax Department.`
  },
];






const onlineBenefits = [
  {
    title: "Save Time & Effort",
    desc: " No need to visit chambers or courts just for a consultation.",
  },
  {
    title: "Convenient Access",
    desc: " Talk to a verified lawyer from anywhere using your phone or laptop.",
  },
  {
    title: "Discreet & Confidential",
    desc: " Private legal matters stay private — you choose when and how to talk.",
  },
  {
    title: "Faster Solutions",
    desc: " Quick answers to urgent questions like legal notices, challans, disputes, etc.",
  },
  {
    title: "Affordable Options",
    desc: "Flexible consultation options compared to traditional visits.",
  },
  {
    title: "Wide Choice",
    desc: "Access lawyers from various practice areas — all in one place.",
  },

];



const whyZolvitCards = [
  {
    img: "https://assets.vakilsearch.com/live-images/whyZolvit1.svg",
    desc: "No waiting, no booking — connect with available lawyers immediately via chat or call.",
  },
  {
    img: "https://assets.vakilsearch.com/live-images/whyZolvit2.svg",
    desc: "From civil and criminal to family, consumer, cyber, and more — we connect you with the right expert. ",
  },
  {
    img: "https://assets.vakilsearch.com/live-images/whyZolvit3.svg",
    desc: "Every lawyer on our platform is verified for qualification and authenticity. ",
  },
  {
    img: "https://assets.vakilsearch.com/live-images/whyZolvit4.svg",
    desc: " Just open the app or website, choose your issue, and talk to a lawyer — it's that simple.",
  },
  {
    img: "https://assets.vakilsearch.com/live-images/whyZolvit5.svg",
    desc: " Access legal support even from remote areas or small towns.",
  },
  {
    img: "https://assets.vakilsearch.com/live-images/whyZolvit6.svg",
    desc: "Your data and conversations stay safe, and pricing (if any) is always shown upfront.",
  },
];






const categories = [
  {
    title: "Property & Real Estate",
    services: [
      "Land Acquisition Matters",
      "Property Registration",
      "Property Verification",
      "Estate Planning",
      "Property Succession",
      "Will Drafting and Registration",
      "Landlord/Tenant Disputes",
      "RERA Consultation",
      "Relinquishment Deed",
      "Power of Attorney",
      "Gift Deed",
      "Rental Tenant Notice",
      "Mutation of Property",
      "Partition Suit",
    ],
  },
  {
    title: "Family & Personal Law",
    services: [
      "Family Lawyer",
      "Divorce & Matrimonial Consultation",
      "Maintenance and Alimony",
      "Child Custody and Guardianship",
      "Muslim Personal Law Matters",
      "Domestic Violence Cases",
      "Legal Heir Certificate",
      "Dowry Harassment Cases",
      "Judicial Separation",
      "Adoption & Guardianship Matters",
    ],
  },
  {
    title: "Civil Law",
    services: [
      "Civil Lawyer",
      "Defamation Cases",
      "Legal Notices",
      "Cheque Bounce Cases",
      "Money Recovery Issues",
      "Mediation / Arbitration",
      "Writ Petition / PIL",
      "Loan Recovery / Bank Account Freeze-Unfreeze",
      "E-Court Filing Procedures",
      "National Green Tribunal Cases",
      "Debt Recovery Tribunal (DRT)",
      "Motor Accident Claims / Traffic Challans",
      "MSME Samadhan / MSME Recovery",
      "Insolvency & Bankruptcy Code (IBC)",
      "Rent Control Matters",
      "Legal Retainer Services",
      "Partition Suits",
      "Civil Injunctions",
    ],
  },
  {
    title: "Cyber Law",
    services: [
      "Cyber Lawyer",
      "Cyber Crime Complaints",
      "Online Fraud / Scam Complaints",
      "IT Act Violations",
      "Social Media Defamation",
      "Hacking / Data Theft Cases",
      "Phishing and Online Financial Frauds",
      "Cyberbullying and Online Harassment",
      "Unauthorized Access / Privacy Breach",
      "Filing Cyber Complaints via Cyber Cells",
    ],
  },
  {
    title: "Criminal Law",
    services: [
      "Criminal Lawyer",
      "Criminal Bail Application",
      "NDPS (Drugs & Psychotropic Substances Act)",
      "Criminal Trial Court Matters",
      "File a Criminal Complaint",
      "Quashing of FIR",
      "Criminal Appeals and Revisions",
      "Anticipatory Bail",
      "White Collar Crimes",
    ],
  },
  {
    title: "Consumer Law",
    services: [
      "Consumer Lawyer",
      "File a Consumer Case",
      "Consumer Law Consultation",
      "Misleading Advertisements Cases",
      "Defective Product / Service Complaints",
      "Legal Notices under Consumer Law",
      "Delay in Service or Possession (e.g., real estate)",
    ],
  },
  {
    title: "Corporate & Business Law",
    services: [
      "Company Law & Corporate Compliance",
      "Legal Retainer for Companies",
      "Political Party Registration",
      "Company / LLP / Startup Incorporation",
      "ESOP & Fundraising Consultation",
      "Business Debt Restructuring",
      "Drug & Cosmetic License",
      "Legal Metrology License",
      "POSH Internal Committee Setup",
      "Business Contracts & Documentation",
      "Business Due Diligence",
      "Barcode & BIS License",
      "ROC Filings & MCA Compliance",
    ],
  },
  {
    title: "Labour & Employment Law",
    services: [
      "Labour Lawyer",
      "Employment Disputes (Employee/Employer)",
      "POSH Sexual Harassment at Workplace",
      "CLRA (Contract Labour Regulation)",
      "Gratuity / Provident Fund Disputes",
      "Termination & Severance Advisory",
      "Drafting Employment Contracts",
    ],
  },
  {
    title: "Legal Notices & Drafting",
    services: [
      "Legal Notice Drafting",
      "Drafting & Sending Legal Notices",
      "Legal Notice for Recovery of Dues",
      "Cheque Bounce Legal Notice",
      "Legal Notice under Consumer Protection",
      "Contract Breach Notice",
    ],
  },
];


 const [openIndex, setOpenIndex] = React.useState(null);

  const handleToggle = (idx) => {
    setOpenIndex(idx === openIndex ? null : idx);
  };


  const [specialization, setSpecialization] = useState('');
  const [court, setcourt] = useState('');
  const[language,setlanguage]=useState('')

    const SPECIALIZATIONS = [
  { value: '', label: 'Select Specialization' },
  { value: 'property lawyer', label: 'Property Lawyer' },
  { value: 'family lawyer', label: 'Family Lawyer' },
  { value: 'civil lawyer', label: 'Civil Lawyer' },
  { value: 'cyber lawyer', label: 'Cyber Lawyer' },
  { value: 'criminal lawyer', label: 'Criminal Lawyer' },
  { value: 'consumer lawyer', label: 'Consumer Lawyer' },
  { value: 'labour lawyer', label: 'Labour Lawyer' },
  { value: 'legal notice drafting', label: 'Legal Notice Drafting' },
  { value: 'company law & corporate compliance', label: 'Company Law & Corporate Compliance' },
];

const Courts = [
  { value: '', label: 'Select Courts' },
  { value: 'other', label: 'Other' },
  { value: 'tis_hazari_court', label: 'Tis Hazari Court' },
  { value: 'saket_court', label: 'Saket Court' },
  { value: 'karkardooma_court', label: 'Karkardooma Court' },
  { value: 'patiala_house_court', label: 'Patiala House Court' },
  { value: 'rohini_court', label: 'Rohini Court' },
  { value: 'dwarka_court', label: 'Dwarka Court' },
  { value: 'rouse_avenue_court', label: 'Rouse Avenue Court' },
  { value: 'high_court', label: 'High Court' },
];

const languages=[
  {value:'',label:'Select language'},
  {value:'hindi',label:'Hindi'},
  {value:'english',label:'English'},

]


//========================================== chat start=========================================================================


  const [isLoading, setIsLoading] = useState(false);

  const [recentChats, setRecentChats] = useState([]);
  const fileInputRef = useRef(null);


const userData = JSON.parse(localStorage.getItem('userDetails'));



  const fetchChatHistory=async()=>
  {
    try {
        const res=await api.get('api/admin/chathistory')
        const result=res.data
        const clientChats = result.filter(
            chat => chat.from === userData.user._id && chat.fromModel === "User"
            );
        setRecentChats(clientChats)
        
    } catch (error) {
        console.log(error);
        
    }
  }
  // Fetch chat history for the logged-in user
  useEffect(() => {
    
    fetchChatHistory()
  }, []);

  // Deduplicate by lawyer ID ("to" field)
const uniqueChatsMap = {};
const uniqueChats = [];
recentChats.forEach(chat => {
  if (!uniqueChatsMap[chat.to]) {
    uniqueChatsMap[chat.to] = true;
    uniqueChats.push(chat);
  }
});



  






//========================================= chat start=============================================================

  const [lawyers, setLawyers] = useState([]);
  const [chatLawyer, setChatLawyer] = useState(null);
  const [onlineLawyers, setOnlineLawyers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [messageMap, setMessageMap] = useState({});
    const [message, setMessage] = useState('');

  const fetchlawyers = async () => {
    try {
      const resp = await api.get('api/lawyer/getalllawyerprofile');
      setLawyers(resp.data.filter((item) => (item.status === "verified")));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchlawyers();
  }, []);




const [isAccepted, setIsAccepted] = useState(false);





    useEffect(() => {
    if (!userData?.user._id) return;

    if (!socket.connected) socket.connect();

    socket.on('connect', () => {
      console.log('✅ Connected (client):', socket.id);
      socket.emit('clientOnline', userData.user._id);
      socket.emit('getOnlineLawyers');
    });

    socket.on('onlineLawyersList', (ids) => {
      console.log('✅ Received online lawyers:', ids);
      setOnlineLawyers(ids);
    });

    socket.on('updateOnlineUsers', (ids) => {
      setOnlineLawyers(ids);
    });

    



     const receiveMessage = async ({ from, message, fileUrl, fileName, fileType }) => {
      // setHasNewMessages(true);
        markMessagesRead(from);
      // Add message (with file info if present) to the message map
      setMessageMap((prev) => ({
        ...prev,
        [from]: [
          ...(prev[from] || []),
          { text: message, fileUrl, fileName, fileType, isMe: false }
        ],
      }));
   
    
      // If this client is currently selected, add message to visible chat
      if (chatLawyer?._id === from) {
        setMessages((prev) => [
          ...prev,
          { text: message, fileUrl, fileName, fileType, isMe: false }
        ]);
       
      }
    
     
    };

       socket.on('receiveMessage', receiveMessage);

    return () => {
      socket.off('connect');
      socket.off('receiveMessage');
      socket.off('onlineLawyersList');
      socket.off('updateOnlineUsers');
      socket.disconnect();
    };
  }, [userData?.user._id, chatLawyer]);


  const [loginTime, setLoginTime] = useState(Date.now());


useEffect(() => {
  if (userData?.user._id) {
    // Record login time in milliseconds
    setLoginTime(Date.now());
    console.log("✅ User logged in at:", new Date(Date.now()).toLocaleString());
  }
}, [userData?.user._id]);



const [firstMessageSent, setFirstMessageSent] = useState(false);

const save_first_chat_time = async (chattime) => {
  try {
    const response = await api.post('api/admin/first_chat_time', {
      userId: userData?.user?._id,
      timeToFirstChatMs: chattime,
    });
    console.log("First chat time saved:", response.data);
  } catch (error) {
    console.error("Error saving first chat time:", error);
  }
};


  const handleSendMessage = (text, lawyer) => {
  // ✅ first set state for later renders
  // if (lawyer) setChatLawyer(lawyer._id);

  // ✅ use lawyer param if provided, else fallback to chatLawyer
  const targetLawyer = lawyer || chatLawyer;

  if (!text.trim() || !targetLawyer?._id) return;

 
  if (containsSensitiveInfo(text)) {
    Swal.fire({
      icon: 'warning',
      title: 'Not Allowed 🚫',
      text: 'Sharing mobile numbers or emails is not permitted!',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
    return;
  }

 if (!firstMessageSent) {
    const timeToFirstChatMs = Date.now() - loginTime;
    console.log("⏱ Time to first chat:", timeToFirstChatMs, "ms");
    save_first_chat_time(timeToFirstChatMs)
    setFirstMessageSent(true);
  }


  const timestamp = new Date().toISOString();

  socket.emit('privateMessage', {
    toUserId: targetLawyer._id,  // ✅ send to lawyer immediately
    message: text,
    fromUserType: 'client',
    timestamp
  });

  setMessages((prev) => [...prev, { text, isMe: true, timestamp }]);
};


    const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !chatLawyer?._id) return;
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/admin/document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fileUrl = res.data.url;
      const fileType = file.type;

      socket.emit('privateMessage', {
        toUserId: chatLawyer._id,
        message: '',
        fileUrl,
        fileName: file.name,
        fileType,
        fromUserType: 'client'
      });

      setMessages((prev) => [
        ...prev,
        { text: '', fileUrl, fileName: file.name, fileType, isMe: true }
      ]);
    } catch (err) {
      alert('Upload failed');
    }
    setIsLoading(false);
  };

const markMessagesRead = async (lawyerid) => {
  try {
    const userid = userData.user._id;
    socket.emit('markMessagesRead', {
      readerId: userid,
      senderId: lawyerid,
      readerModel: 'User'
    });
  } catch (err) {
    console.error('Failed to mark messages read', err);
  }
};


  
  const handleOpenChat = async (lawyer) => {

  const startTime = new Date(); // current timestamp
  localStorage.setItem('switchStartTime', startTime.toISOString());


    const isOnline = onlineLawyers.includes(lawyer._id);
    setChatLawyer({ ...lawyer, isOnline });
    
    markMessagesRead(lawyer._id);

    const clientId = userData.user._id;
    const lawyerId = lawyer._id;

    try {
      const res = await api.get(`api/admin/chathistory/${clientId}/${lawyerId}`);
      const data = await res.data;

      let formatted = data.map(msg => ({
        text: msg.message,
        isMe: msg.from === clientId,
        isSystem: false,
        fileUrl:msg.fileUrl,
        fileName:msg.fileName, 
        fileType:msg.fileType,
        timestamp: msg.timestamp
      }));

      if (formatted.length === 0) {
        const systemMessage = {
          text: `You are now connected to Advocate ${lawyer.firstName} ${lawyer.lastName} who practices in ${lawyer.practicingcourts.map((item)=>item.label).join(',')} Courts and specializes in ${lawyer.specializations.map((item)=>item.label).join(',')}, With ${lawyer.yearsOfExperience} of experience. Feel free to share your concern or upload documents securely`,
          isSystem: true,
          isMe: false,
        };
        formatted = [systemMessage];
      }

      setMessages(formatted);
      setMessageMap(prev => ({ ...prev, [lawyerId]: formatted }));
    } catch (err) {
      console.error('❌ Error fetching chat history:', err);
    }
  };

  function containsSensitiveInfo(text) {
    const phoneRegex = /(?:\+91[\s-]?)?[6-9]\d{9}/g;
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}\b/i;
    return phoneRegex.test(text) || emailRegex.test(text);
  }

  const [isFlipping, setIsFlipping] = useState(false);

const sessiontime=async(switchtime,sessiontime)=>
{
  try {
    alert("hello")
    const payload={switchtime,sessiontime}
    const resp=await api.post(`api/admin/session-time`,payload)
    console.log(payload);
    
  } catch (error) {
    console.log(error);
    
  }
}

const logSessionTime = async () => {
  const start = localStorage.getItem('switchStartTime');
  if (start && chatLawyer?._id) {
    const startTime = new Date(start);
    const durationSec = Math.floor((new Date() - startTime) / 1000);

    try {
      const payload = {user:userData.user._id, sessionTime: durationSec, switchTime: 0 };
      await api.post('api/admin/session-time', payload);
    } catch (error) {
      console.error('Session logging error:', error);
    }
  }
};


const logswitchtime = async () => {
  const start = localStorage.getItem('switchStartTime');
  if (start && chatLawyer?._id) {
    const startTime = new Date(start);
    const durationSec = Math.floor((new Date() - startTime) / 1000);

    try {
      const payload = {user:userData.user._id, sessionTime: 0, switchTime: durationSec };
      await api.post('api/admin/session-time', payload);
    } catch (error) {
      console.error('Session logging error:', error);
    }
  }
};


const handleSwapLawyer = async () => {

  logswitchtime();

setIsLoading(true)
  // Wait for the first half of the flip
  setTimeout(async () => {
      setIsFlipping(true); // Start flip
      setIsLoading(false)
    const availableOnlineLawyers = lawyers.filter(
      (lawyer) => onlineLawyers.includes(lawyer._id) && lawyer._id !== chatLawyer._id
    );

    if (availableOnlineLawyers.length === 0) {
      Swal.fire({
        icon: 'info',
        title: 'No Other Lawyers Online',
        text: 'Sorry, there are no other online lawyers to swap with right now.',
        timer: 2500,
        showConfirmButton: false,
      });
      setIsFlipping(false);
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableOnlineLawyers.length);
    const newLawyer = availableOnlineLawyers[randomIndex];

    await handleOpenChat(newLawyer);

    // End flip after the second half
    setTimeout(() => setIsFlipping(false), 300); // 300ms for the second half
  }, 2000); // 300ms for the first half
};


//===================== for typing indicator================================================

const handleTyping = () => {
  if (!chatLawyer?._id) return;
  socket.emit('typing', {
    toUserId: chatLawyer._id,
    fromUserType: 'client',
    name: userData.user.fullName || 'Client',
    fromUserId: userData.user._id
  });
};

const [typingStatus, setTypingStatus] = useState('');
const typingTimeout = useRef();

useEffect(() => {
  socket.on('typing', ({ fromUserType, name, fromUserId }) => {
    if (chatLawyer?._id === fromUserId) { // Only current chat
      setTypingStatus(`typing...`);
      clearTimeout(typingTimeout.current);
      typingTimeout.current = setTimeout(() => setTypingStatus(''), 1500); // hides after 1.5s
    }
  });
  return () => socket.off('typing');
}, [chatLawyer]);


useEffect(() => {
  
  
  socket.on("chatAccepted", ({ lawyerId }) => {
    if (chatLawyer?._id === lawyerId) {
      setIsAccepted(true); // ✅ now allow sending messages
    }
  });
  return () => socket.off("chatAccepted");
}, [chatLawyer]);


useEffect(() => {
  
  
  socket.on("chatRejected", ({ lawyerId }) => {
    if (chatLawyer?._id === lawyerId) {
      setIsAccepted(true); // ✅ now allow sending messages
    }
  });
  return () => socket.off("chatAccepted");
}, [chatLawyer]);





//============================= when chat close===========================================================
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


//====================================================== chat end===================================================================



//=============================== Filter lawyers based on search===================================


const case_type=async(specialization)=>
{
  try {
    const payload={type_of_case:specialization}

    const resp=await api.post('api/admin/case-type',payload)
    
  } catch (error) {
    console.log(error);
    
  }
}


const filterLawyersAndChat = () => {
  if (!userData?.user._id) {
    return navigate('/login');
  }

  setIsLoading(true);
  setTimeout( async() => {
    setIsLoading(false);

 let filtered = lawyers.filter(lawyer => onlineLawyers.includes(lawyer._id));

    // ✅ Must match specialization
    if (specialization) {
      case_type(specialization)
      filtered = filtered.filter(lawyer =>
        Array.isArray(lawyer.specializations)
          ? lawyer.specializations.some(spec =>
              (spec.label && spec.label.toLowerCase().includes(specialization.toLowerCase())) ||
              (spec.value && spec.value.toLowerCase().includes(specialization.toLowerCase()))
            )
          : (lawyer.specializations?.label || lawyer.specializations?.value || lawyer.specializations || '')
              .toLowerCase()
              .includes(specialization.toLowerCase())
      );
    }

    // ✅ Must match language
    if (language) {
      filtered = filtered.filter(lawyer =>
        Array.isArray(lawyer.languages)
          ? lawyer.languages.some(lang =>
              (lang.label && lang.label.toLowerCase().includes(language.toLowerCase())) ||
              (lang.value && lang.value.toLowerCase().includes(language.toLowerCase()))
            )
          : (lawyer.languages?.label || lawyer.languages?.value || lawyer.languages || '')
              .toLowerCase()
              .includes(language.toLowerCase())
      );
    }

    // ✅ Court is optional
    let courtMatched = [];
    if (court && court.trim() !== "") {
      courtMatched = filtered.filter(lawyer =>
        Array.isArray(lawyer.practicingcourts) &&
        lawyer.practicingcourts.some(c =>
          [c.label, c.value].some(
            v => v && v.toLowerCase() === court.toLowerCase()
          )
        )
      );
    }

    // ✅ If courtMatched not empty, prefer it. Otherwise keep specialization+language result
    if (courtMatched.length > 0) {
      filtered = courtMatched;
    }

    // ✅ No lawyers found after filtering
    if (filtered.length === 0) {
      Swal.fire({
        icon: "info",
        title: "Search result...",
        text: "No lawyers available.",
        showConfirmButton: "true"
      });
      return;
    }

  
    

    // ✅ Try to find an online lawyer
    let candidates = [...filtered];
    while (candidates.length > 0) {
      const idx = Math.floor(Math.random() * candidates.length);
      const candidate = candidates[idx];
      if (onlineLawyers.includes(candidate._id)) {

         await handleOpenChat(candidate);

         handleSendMessage("hello",candidate);
        return;
      }
      candidates.splice(idx, 1);
    }

    // ✅ No online lawyer in filtered
    Swal.fire({
      icon: "info",
      title: "Search result...",
      text: "No lawyers available online.",
      showConfirmButton: "true"
    });
  }, 2000);
};



    return(
<div>
      <Header/>
  <div className="olc-root">

    <section className="olc-banner-bg" style={{marginTop:"10px"}}>
      <div className="olc-banner" id="main-banner">
       
        <div className="olc-banner-content">
          {/* Left: Headline and Benefits */}
          <div className="olc-banner-left">
         <div className="olc-process-desktop">
              <p className="olc-process-title">Process</p>
             <div className="olc-process-steps">
  <div className="olc-process-step">
     <span style={{ fontSize: '32px' }} className="icons">📝</span>
    <span>Select details</span>
  </div>
   <span className="arrow"
   style={{
  fontSize: '32px',
  background:"#2d3a5c",
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold'
}}>
  &gt;&gt;
</span>
  <div className="olc-process-step">
    <span style={{ fontSize: '32px' }} className="icons">⏳</span>
    <span>Wait for a few minutes</span>
  </div>
  <span className="arrow"
  style={{
  fontSize: '32px',
  background: "#2d3a5c",
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  fontWeight: 'bold'
}}>
  &gt;&gt;
</span>
  <div className="olc-process-step">
    <span style={{ fontSize: '32px' }} className="icons">💬</span>
    <span>Chat with lawyer</span>
  </div>

  
</div>

            </div>
               {/* Process Steps (Mobile) */}
        {/* <div className="olc-process-mobile">
          <p className="olc-process-title">Process</p>
          <div className="olc-process-steps">
           <div className="olc-process-step">
     <span style={{ fontSize: '32px' }}>📝</span>
    <span>Select details</span>
  </div>
  <div className="olc-process-step">
    <span style={{ fontSize: '32px' }}>⏳</span>
    <span>Wait for a few minutes</span>
  </div>
  <div className="olc-process-step">
    <span style={{ fontSize: '32px' }}>💬</span>
    <span>Chat with lawyer</span>
  </div>
          </div>
        </div> */}

            <div className="findlawyer">
  <div className="findlawyer-glass" />
  <h2 className="findlawyer-title">
    🔎 Find a Lawyer
  </h2>
  <div className="findlawyer-controls">
    <select
      value={specialization}
      onChange={e => setSpecialization(e.target.value)}
      className="findlawyer-select"
    >
      {SPECIALIZATIONS.map(spec => (
        <option key={spec.value} value={spec.value}>
          {spec.label}
        </option>
      ))}
    </select>
    <select
      value={court}
      onChange={e => setcourt(e.target.value)}
      className="findlawyer-select"
    >
      {Courts.map(st => (
        <option key={st.value} value={st.value}>
          {st.label}
        </option>
      ))}
    </select>
       <select
      value={language}
      onChange={e => setlanguage(e.target.value)}
      className="findlawyer-select"
    >
      {languages.map(st => (
        <option key={st.value} value={st.value}>
          {st.label}
        </option>
      ))}
    </select>
    <button
      className="action-btn findlawyer-btn"
      title="Chat Now"
      onClick={filterLawyersAndChat}
    >
      Chat Now
    </button>
  </div>
</div>



          
           
          </div>
        
        </div>
     

           <section class="legal-queries-section">
  <h2 class="section-title">Most Asked Legal Queries</h2>
  <div class="queries-grid">
    <div class="query-card" onClick={()=>setSpecialization('civil lawyer')}>
      {/* <span class="query-icon">🚗</span> */}
      <h3>Car Challan</h3>
      {/* <p>Information and help regarding traffic fines and challans.</p> */}
    </div>
    {/* <div class="query-card">
      <span class="query-icon">📄</span>
      <h3>Legal Notice</h3>
      {/* <p>Drafting and responding to legal notices efficiently.</p> 
    </div> */}
    <div class="query-card" onClick={()=>setSpecialization('legal notice drafting')}>
      {/* <span class="query-icon ">💸</span> */}
      <h3>Cheque Bounce</h3>
      {/* <p>Guidance on cheque bounce cases and legal remedies.</p> */}
    </div>
    <div class="query-card" onClick={()=>setSpecialization('consumer lawyer')}>
      {/* <span class="query-icon">📦</span> */}
      <h3>Product/Service Default</h3>
      {/* <p>Assistance for faulty products or unsatisfactory services.</p> */}
    </div>
    <div class="query-card" onClick={()=>setSpecialization('cyber lawyer')}>
      {/* <span class="query-icon">🕵️</span> */}
      <h3>Online Fraud</h3>
      {/* <p>Support for victims of cyber fraud and scams.</p> */}
    </div>
  </div>
</section>

      </div>

 


     

 

<section class="lawyer-help-section">
  <h2 class="help-title">Not sure which type of lawyer you need?</h2>
  <p class="help-desc">
    No problem! <a href="https://www.google.com/" target="_blank" class="google-link">Click here</a> and type the following:<br></br>
    <span class="help-template">"My legal issue is [your case]. What category of lawyer do I need — criminal, civil, family, corporate, consumer, labour, or cyber?"</span>
  </p>
  <div class="help-example">
    <strong>Example:</strong><br></br>
    My legal issue is my employer is not paying my salary. What category of lawyer do I need — criminal, civil, family, corporate, consumer, labour, or cyber?
  </div>

</section>

 <section className="olc-expertise-section">
    <h2 className="olc-expertise-title">Legal Matter Categories</h2>
    <div className="olc-expertise-list">
      {legalExpertise.map((area, idx) => (
        <div className="olc-expertise-card" key={area.title}>
          <img
            src={area.img}
            alt={area.alt}
            className="olc-expertise-img"
            loading="lazy"
          />
          <div className="olc-expertise-content">
            <p className="olc-expertise-area">
              <a href={area.link} target="_blank" rel="noopener noreferrer">
                {area.title}
              </a>
            </p>
            <p className="olc-expertise-desc">{area.description}</p>
            {/* <a href={area.link} target="_blank" rel="noopener noreferrer">
              <button className="olc-expertise-btn">{area.cta}</button>
            </a> */}
          </div>
        </div>
      ))}
    </div>
  </section>

   <div className="legal-services-container">
    <h2 className="legal-services-heading">Services Provided by Lawyers</h2>
    <div className="service-card-grid">
      {categories.map((cat) => (
        <div key={cat.title} className="service-card">
          <div className="category-title">{cat.title}</div>
          <ul className="service-list">
            {cat.services.map((srv) => (
              <li key={srv}>{srv}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
 
  </div>

 <section className="olc-legalrep-section">
    <div className="olc-legalrep-container">
      <h2 className="olc-legalrep-title">Importance of Legal Representation</h2>
      <p className="olc-legalrep-lead">
        Having skilled legal representation ensures your rights are protected and offers expert guidance through complex legal matters. A qualified lawyer provides strategic advice, minimises risks, and strengthens your position in disputes or negotiations. Below are some reasons for hiring a lawyer:
      </p>
      <ul className="olc-legalrep-list">
        {legalPoints.map((point, idx) => (
          <li className="olc-legalrep-listitem" key={idx}>
            <span className="olc-legalrep-dot"></span>
            <span>
              <b>{point.title}</b> {point.desc}
            </span>
          </li>
        ))}
      </ul>
    </div>
  </section>

 



   <section className="olc-benefits-section">
    <h2 className="olc-benefits-title">Benefits of Online Lawyer Consultation</h2>
    <div className="olc-benefits-wrapper">
      <p className="olc-benefits-lead">
        Online lawyer consultations offer numerous advantages that enhance your legal experience. Here’s how you can benefit:
      </p>
      <div className="olc-benefits-list-bg">
        <div className="olc-benefits-list">
          {onlineBenefits.map((item, idx) => (
            <div className="olc-benefit-card" key={idx}>
              <p className="olc-benefit-title">{item.title}:</p>
              <p className="olc-benefit-desc">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>


 <section className="olc-whyzolvit-section">
    <div className="olc-whyzolvit-container">
      <h2 className="olc-whyzolvit-title">
        Why Choose Counvo For Online Legal Consultation?
      </h2>
      <p className="olc-whyzolvit-lead">
        Counvo offers tailored legal support, ensuring that you are connected with experienced lawyers. Whether it be corporate, personal, business, or IP law, we provide access to a network of skilled Lawyers across various niches. Our platform simplifies the process, offering transparent communication, efficient legal counsel, and ongoing support throughout the legal process. Choose Zolvit for comprehensive legal solutions, personalised attention, and a hassle-free experience in securing the best legal consultation for your case.
      </p>
      <div className="olc-whyzolvit-grid">
        {whyZolvitCards.map((card, idx) => (
          <div className="olc-whyzolvit-card" key={idx}>
            <div className="olc-whyzolvit-img-bg">
              <img
                src={card.img}
                alt=""
                className="olc-whyzolvit-img"
                loading="lazy"
              />
              <img
                src="https://assets.vakilsearch.com/live-images/bg.svg"
                alt=""
                className="olc-whyzolvit-bg"
                aria-hidden="true"
                loading="lazy"
              />
            </div>
            <p className="olc-whyzolvit-desc">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>






{/*========================================= chat section start============================================================= */}
      <style>{`

  .lawyers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
        }

        .lawyer-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
          text-align: center;
          transition: all 0.3s ease;
          border: 1px solid #e5e7eb;
        }

        .lawyer-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
          background: white;
        }

        .lawyer-avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #3b82f6;
          margin: 0 auto 1rem;
        }

        .lawyer-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1f2937;
          margin-bottom: 0.5rem;
        }

        .lawyer-status {
          font-size: 0.875rem;
          margin-bottom: 0.5rem;
        }

        .lawyer-details {
          font-size: 0.875rem;
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .lawyer-actions {
          display: flex;
          justify-content: center;
          gap: 0.75rem;
        }

        .action-btn {
          background: white;
          color:blue;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          padding: 0.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .action-btn:hover {
          background: #f3f4f6;
          transform: translateY(-1px);
        }
      .chat-popup {
          position: fixed;
          bottom: 10px;
          left:40%;
          width: 480px;
          height: 600px;
          background: white;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
          overflow: hidden;
          z-index: 1000;
          display: flex;
          flex-direction: column;
        }

        .chat-header {
          background: linear-gradient(135deg, #3b82f6, #1e40af);
          color: white;
          padding: 1rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .chat-messages {
          flex: 1;
          padding: 1rem;
          overflow-y: auto;
          background: #f9fafb;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .message {
          max-width: 80%;
          padding: 0.75rem 1rem;
          border-radius: 18px;
          font-size: 0.875rem;
          line-height: 1.4;
          word-wrap: break-word;
        }

        .message.sent {
          align-self: flex-end;
          background: #3b82f6;
          color: white;
        }

        .message.received {
          align-self: flex-start;
          background: white;
          color: #1f2937;
          border: 1px solid #e5e7eb;
        }

        .message.system {
          align-self: center;
          background: #eff6ff;
          color: #1e40af;
          border: 1px solid #bfdbfe;
          text-align: center;
          font-style: italic;
        }

     .chat-input {
       width:85%;
  display: flex;
  align-items: center;
  padding: 1rem;
  border-top: 1px solid #e5e7eb;
  background: white;
  gap: 0.5rem;
}


      .chat-input input {
  flex: 1 1 auto;

  padding: 0.75rem 1rem;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.2s ease;
  background: #fff;
}
  .actionbutton{
        margin-top:10px !important;
  }


        .chat-input input:focus {
          border-color: #3b82f6;
        }

  
    @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
            padding: 1rem;
          }

          .charts-grid {
            grid-template-columns: 1fr;
          }

          .time-info {
            flex-direction: column;
            gap: 0.5rem;
          }

          .lawyers-grid {
            grid-template-columns: 1fr;
          }

          .chat-popup {
            width: calc(100vw - 20px);
            height: calc(100vh - 100px);
            bottom: 10px;
            right: 10px;
            left: 10px;
          }
              @media (max-width: 1024px) {
    .lawyers-grid {
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }
    .chat-popup {
      width: 320px;
      height: 450px;
    }
  }

@media (max-width: 480px) {
  .main1 {
    margin-left: 0px;
  }
  .lawyers-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  .chat-popup {
    width: 100vw;
    height: 100% !important;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: 0;
  }
  .chat-header {
    flex-direction: row;
    align-items: center;
    gap: 0.5rem;
    height: 56px;
    justify-content: space-between;
    padding: 0.5rem 1rem;
  }
  .header-actions {
    margin-left: 0;
    margin-top: 0;
    display: flex;
    gap: 0.5rem;
  }
 .chat-input {
    padding-bottom: 2.5rem;
    gap: 0.25rem;
  }
  .chat-input input {
    font-size: 1rem;
    padding: 0.65rem 1rem;
    width:70%
  }
    .actionbutton
    {
    margin-top:5px !important;
    }

  select {
    min-width: 100% !important;
  }
  .main1 > div {
    padding: 20px 8px !important;
  }
    .typing-indicator
    {
        position:absolute;
        padding-left:40%;
        margin-top:-10px;
    }
    
}
    @media (max-width: 380px) {
     .actionbutton
    {
    margin-top:-10px !important;
    }

      }

      
        
      `}</style>

  {/* Chat Popup */}

      {chatLawyer && (
        <div className={`chat-popup${isFlipping ? ' flip' : ''}`}>
          <div className="chat-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <img
                src={chatLawyer.profilepic}
                alt="profile"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid white',
                }}
              />
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                  {chatLawyer.firstName} {chatLawyer.lastName}
                  {/* <span style={{fontSize:"10px",color:"lightgray",fontWeight:"normal"}}>
                    {chatLawyer.yearsOfExperience}years of experience</span> */}
                 

                </div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>
                  {chatLawyer.isOnline ? '🟢 Online' : '🔴 Offline'}
                </div>
              </div>
            </div>
                 {typingStatus && <div className="typing-indicator" style={{color:"white",paddingRight:"80px",paddingTop:"20px"}}>{typingStatus}</div>}
            <div className="header-actions">
        <button
        onClick={handleSwapLawyer}
           style={{
                background: 'white',
                border:"1px solid lightgray",
                color: 'black',
                fontSize: '12px',
                cursor: 'pointer',
              }}
        
          title="Switch Lawyer"
        >
          Switch
          {/* <span style={{fontSize:"14px"}}>switch</span> */}
        </button>
        <button
           style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
              }}
              onClick={() => {
                  logSessionTime()
                  // const start = localStorage.getItem('switchStartTime');
                  // if (start && chatLawyer?._id) {
                  //   const startTime = new Date(start);
                  //   const now = new Date();
                  //   const durationMs = now - startTime; // in milliseconds
                  //   const durationSec = Math.floor(durationMs / 1000);

                  //   console.log(`User spent ${durationSec} seconds with lawyer ${chatLawyer._id}`);
                  // }

              Swal.fire({
                title: "Are you sure?",
                text: "Do you really want to close the chat?",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Yes, close it!",
                 didOpen: () => {
                  document.querySelector('.swal2-container').style.zIndex = '9999';
                }
                
              }).then((result) => {
                if (result.isConfirmed) {
                  setChatLawyer(null);
                  handleSendMessage("user closed the chat");
                  handleShow(); // open modal after confirmation
                  Swal.fire("Closed!", "Your chat has been closed.", "success");
                }
              });
            }}
          
          
          title="Close Chat"
        >
          ✖
        </button>
      </div>
    
            {/* <button
              onClick={() => setChatLawyer(null)}
              style={{
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '18px',
                cursor: 'pointer',
              }}
            >✖</button> */}
          </div>

       <div className="chat-messages">
  {!isAccepted ? (
    // Show loader while waiting
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        padding: "20px",
      }}
    >
      {/* Spinner */}
      <div
        style={{
          border: "4px solid #f3f3f3",
          borderTop: "4px solid #3b82f6",
          borderRadius: "50%",
          width: 40,
          height: 40,
          animation: "spin 1s linear infinite",
          marginBottom: 12,
        }}
      ></div>
      <span style={{ color: "#3b82f6", fontWeight: 500 }}>
        Waiting for lawyer to accept your request...
      </span>

      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        `}
      </style>
    </div>
  ) : (
    // Normal messages after accepted
    <>
      {messages.map((msg, idx) => (
        <div key={idx} className={`message ${msg.isMe ? 'sent' : 'received'}`}>
          {msg.text}
          {msg.fileUrl && (
            msg.fileType && msg.fileType.startsWith('image/') ? (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                <img src={msg.fileUrl} alt={msg.fileName} style={{ maxWidth: 150, maxHeight: 150 }} />
              </a>
            ) : (
              <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                📄 {msg.fileName}
              </a>
            )
          )}
          <div style={{ fontSize: '10px', color: 'black', marginTop: '2px', textAlign: msg.isMe ? 'right' : 'left' }}>
            {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : ''}
          </div>
        </div>
      ))}
    </>
  )}
</div>


          <div className="chat-input"
           style={{
    pointerEvents: isAccepted ? "auto" : "none", // disables all interactions if false
    opacity: isAccepted ? 1 : 0.6, // optional: makes it look disabled
  }} >
            <input
    type="file"
    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
    ref={fileInputRef}
    style={{ display: 'none' }}
    onChange={handleFileChange}
  />
            <input
            value={message}
              type="text"
              placeholder="Type a message..."
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                handleTyping()
                if (e.key === 'Enter' && e.target.value.trim()) {
                  handleSendMessage(e.target.value.trim());
                  setMessage('');
                }
              }}
            />
              <button
              className="actionbutton"
    type="button"
    onClick={()=>{handleSendMessage(message);
       setMessage('')}
      }
    style={{
      position: 'absolute',
      right: '20px',
      top: '92%',
      transform: 'translateY(-50%)',
      background: 'none',
      border: 'none',
      color: '#54656f',
      fontSize: '24px',
      cursor: 'pointer',
      padding: 0,
      margin: 0
    }}
    title="Send"
    tabIndex={-1}
  >
    <IoSend />
  </button>

   <button
     className="actionbutton"
  type="button"
  onClick={() => fileInputRef.current.click()}
  style={{
    position: 'absolute',
    right: '20%',
    top: '92%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: 'gray',
    fontSize: '20px',
    cursor: 'pointer',
    padding: 0,
    margin: 0
  }}
  title="Attach Document"
  tabIndex={-1}
>
    <HiOutlinePaperClip />
</button>
          </div>
       

        </div>
        
      )}

    </section>
    <Footer/>
  </div>

   {isLoading && (
  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "rgba(255,255,255,0.5)",
      backdropFilter: "blur(8px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.9)",
        padding: "40px 60px",
        borderRadius: "20px",
        boxShadow: "0 8px 32px rgba(80,120,220,0.10)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <div
        style={{
          border: "6px solid #e0e7ff",
          borderTop: "6px solid #6366f1",
          borderRadius: "50%",
          width: 60,
          height: 60,
          animation: "spin 1s linear infinite",
          marginBottom: 16,
        }}
      />
      <span style={{ color: "#6366f1", fontSize: 18, fontWeight: 600 }}>
        Connecting you to a lawyer...
      </span>
      <style>
        {`@keyframes spin { 0% { transform: rotate(0deg);} 100% { transform: rotate(360deg);} }`}
      </style>
    </div>
  </div>
)}




  <Modal show={show} onHide={handleClose} backdrop="static" centered>
        <Modal.Header closeButton>
          <Modal.Title>Feedback Form</Modal.Title>
        </Modal.Header>
        <Modal.Body><CustomerFeedbackForm/></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        
        </Modal.Footer>
      </Modal>


  </div>
)
}

export default Home;
