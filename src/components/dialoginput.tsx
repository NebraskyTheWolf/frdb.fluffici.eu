import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from './dialog';
import { Button } from "@/components/button";

interface DialogInputProps {
    title: string;
    reason: string;
    isVisible: boolean;
    onClose: () => void;
    onChange: (reason: string) => void;
    onAdd: () => void;
}

const InputDialog: React.FC<DialogInputProps> = ({ title, reason, isVisible, onClose, onChange, onAdd }) => {
    return (
        <Dialog open={isVisible} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-lg rounded shadow-lg bg-gray-800">
                <DialogHeader className="border-b p-4">
                    <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
                </DialogHeader>
                <DialogDescription className="p-4 flex flex-col">
                    <input
                        type="text"
                        value={reason}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="Enter reason"
                        className="w-full p-3 bg-gray-700 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                    />
                </DialogDescription>
                <DialogFooter className="p-4">
                    <Button
                        type="button"
                        variant={reason.length < 3 ? 'outline' : 'destructive'}
                        onClick={onAdd}
                        disabled={reason.length < 3}
                        className="mr-2"
                    >
                        Blacklist
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                    >
                        Cancel
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InputDialog;
