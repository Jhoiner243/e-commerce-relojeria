"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, X, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";

interface NotificationProps {
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
  showCloseButton?: boolean;
}

const Notification = ({
  type,
  title,
  message,
  onClose,
  autoClose = true,
  autoCloseDelay = 5000,
  showCloseButton = true,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  useEffect(() => {
    if (autoClose) {
      const timer = setTimeout(() => {
        handleClose();
      }, autoCloseDelay);

      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, handleClose]);

 

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Info className="h-5 w-5 text-blue-600" />;
    }
  };

  const getAlertVariant = () => {
    switch (type) {
      case 'success':
        return 'default';
      case 'error':
        return 'destructive';
      case 'warning':
        return 'default';
      case 'info':
        return 'default';
      default:
        return 'default';
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`transition-all duration-300 ease-in-out ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
    }`}>
      <Alert variant={getAlertVariant()} className="relative">
        <div className="flex items-start gap-3">
          {getIcon()}
          <div className="flex-1">
            {title && (
              <AlertTitle className="text-sm font-medium">
                {title}
              </AlertTitle>
            )}
            <AlertDescription className="text-sm">
              {message}
            </AlertDescription>
          </div>
          {showCloseButton && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="h-6 w-6 p-0 hover:bg-transparent"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </Alert>
    </div>
  );
};

export default Notification;
