"use client"

import React, { useState } from "react";
import Slider from "react-slick";
import { FaShieldAlt, FaBan, FaGavel, FaUserShield, FaFilter, FaUsers, FaIdCard, FaTicketAlt } from "react-icons/fa";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Features: React.FC = () => {
  const [expanded, setExpanded] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpanded(expanded === index ? null : index);
  };

  const features = [
    {
      icon: <FaBan />,
      title: "Blacklist",
      shortDescription: "Comprehensive database of unwanted users.",
      fullDescription: "Blacklist is a comprehensive database of unwanted users and known scammers, managed by the FurRaidDB team. In addition to this global list, there is also a local blacklist feature, allowing regular users to manage their own restricted user lists."
    },
    {
      icon: <FaGavel />,
      title: "Moderation",
      shortDescription: "Maintain order and enforce rules efficiently.",
      fullDescription: "Maintain order and enforce rules efficiently with powerful moderation tools. Enable your moderators to quickly address issues, manage user behavior, and ensure compliance with community standards."
    },
    {
      icon: <FaUserShield />,
      title: "Anti-Scammer",
      shortDescription: "Protect your community from scammers.",
      fullDescription: "Protect your community from scammers with our advanced anti-scammer tools. Our system monitors and detects suspicious activities, providing you with real-time alerts and measures to prevent fraud."
    },
    {
      icon: <FaFilter />,
      title: "Spam Filter",
      shortDescription: "Keep your server clean and clutter-free.",
      fullDescription: "Keep your server clean and clutter-free with our advanced spam filter. Automatically detect and remove spam messages, ensuring meaningful conversations are not interrupted."
    },
    {
      icon: <FaUsers />,
      title: "Invite Tracker",
      shortDescription: "Monitor and analyze invite activity.",
      fullDescription: "Monitor and analyze invite activity with our powerful Invite Tracker. Track who is inviting new members to your server and how effective each invite is."
    },
    {
      icon: <FaIdCard />,
      title: "Member Verification",
      shortDescription: "Ensure security and trust in your community.",
      fullDescription: "Ensure security and trust in your community with our member verification system. Users must fill out a form and submit it for review by staff, helping to verify identities and ensure only genuine members join your community."
    },
    {
      icon: <FaTicketAlt />,
      title: "Support Ticket System",
      shortDescription: "Facilitate problem-solving and inquiries.",
      fullDescription: "Facilitate problem-solving and inquiries in your community with our advanced support ticket system. Members can easily create tickets for their issues or questions, which can then be assigned to the appropriate moderators or support staff."
    }
  ];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500, // 2.5 seconds
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
      <section className="py-8">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Features</h2>
          <Slider {...settings}>
            {features.map((feature, index) => (
                <div key={index} className="px-2">
                  <div
                      className={`bg-gray-900 p-6 rounded-lg shadow-md transform transition-all duration-300 cursor-pointer flex flex-col ${expanded === index ? 'shadow-lg max-h-[500px]' : 'hover:shadow-lg max-h-[200px]'}`}
                      onClick={() => toggleExpand(index)}
                      style={{cursor: 'pointer', overflow: 'hidden', height: expanded === index ? 'auto' : '200px'}}
                  >
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      {feature.icon}
                      <span className="ml-2">{feature.title}</span>
                    </h3>
                    <p className="text-lg text-gray-300 flex-grow overflow-hidden">
                      {expanded === index ? feature.fullDescription : `${feature.shortDescription.slice(0, 60)}...`}
                    </p>
                    {expanded !== index && <span className="text-gray-500 mt-2">Click to read more</span>}
                  </div>
                </div>
            ))}
          </Slider>
        </div>
      </section>
  );
};

export default Features;
