import React from 'react';

const Dialog = ({ children }) => <div>{children}</div>;
const DialogTrigger = ({ children }) => <div>{children}</div>;
const DialogContent = ({ children }) => <div>{children}</div>;
const DialogHeader = ({ children }) => <div>{children}</div>;
const DialogTitle = ({ children }) => <h5>{children}</h5>;
const DialogDescription = ({ children }) => <p>{children}</p>;
const DialogFooter = ({ children }) => <div>{children}</div>;

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
};
