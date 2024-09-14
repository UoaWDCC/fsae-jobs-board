import React, { useState, useRef, FormEvent } from 'react';
import { TextInput, Button, Stack, Title } from '@mantine/core';

interface VerifyFormProps {
  email: string;
}

export function VerifyForm({ email }: VerifyFormProps) {
  const [code, setCode] = useState(Array(6).fill(""));
  const inputRefs = useRef<HTMLInputElement[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      // Move focus to the next input if a digit was entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pasteData = e.clipboardData.getData("text");
    const digits = pasteData.slice(0, 6).split("").filter((char) => /^[0-9]$/.test(char));

    if (digits.length > 0) {
      setCode(digits);
      digits.forEach((digit, i) => {
        inputRefs.current[i].value = digit;
      });
      inputRefs.current[Math.min(digits.length, 5)]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && code[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const verificationCode = code.join("");

    try {
      const response = await fetch('http://localhost:3000/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email, // use email prop
          verification_code: verificationCode,
        }),
      });

      const result = await response.json();
      console.log("Response:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Title order={5} style={{ textAlign: 'center', fontStyle: 'italic', marginBottom: '1em' }}>
        You're almost there!<br />Please enter the 6-digit verification code that was sent to your email.
      </Title>
      <div onPaste={handlePaste} style={{ display: 'flex', gap: '1em', marginBottom: '1em' }}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)}
            value={digit}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            maxLength={1}
            size="xl" 
            styles={{ input: { width: '3em', height: '3em', textAlign: 'center', fontSize: '2em', fontWeight: '900', padding: 0 } }} // Adjust styles here
          />
        ))}
      </div>
      <Button color="#0091FF" size="md" type="submit" style={{ marginTop: '1em', width: '50%' }}>
        Continue
      </Button>
    </form>
  );
}
