import {FaSearch} from "react-icons/fa";
import React from "react";

interface GlobalFilterProps {
    globalFilter: string;
    setGlobalFilter: (filterValue: string) => void;
}

export const GlobalFilter: React.FC<GlobalFilterProps> = ({ globalFilter, setGlobalFilter }) => (
    <div className="relative mb-4">
        <input
            value={globalFilter || ""}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search members..."
            className="w-full p-3 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <FaSearch className="absolute top-3 left-3 text-gray-400" />
    </div>
);
