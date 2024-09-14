import React, { useState, useRef, FormEvent, useEffect } from 'react';
import { TextInput, Stack, Title, Button } from '@mantine/core';

interface VerifyFormProps {
  email: string;
}

export function VerifyForm({ email }: VerifyFormProps) {
  const [code, setCode] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(0); // Timer state in seconds
  const [canResend, setCanResend] = useState(true); // State to enable/disable resend text
  const inputRefs = useRef<HTMLInputElement[]>([]);

  useEffect(() => {
    const checkTimer = () => {
      const storedTime = localStorage.getItem('timerStartTime');
      if (storedTime) {
        const startTime = parseInt(storedTime, 10);
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000); // Time elapsed in seconds
        const remaining = Math.max(120 - elapsed, 0); // Time remaining

        setTimer(remaining);
        setCanResend(remaining <= 0);
      }
    };

    checkTimer(); // Initial check

    const intervalId = setInterval(() => {
      if (timer > 0) {
        setTimer(prev => prev - 1);
      } else {
        setCanResend(true);
        localStorage.removeItem('timerStartTime'); // Clear stored timer start time
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value) || value === "") {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

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
          email: email,
          verification_code: verificationCode,
        }),
      });

      const result = await response.json();
      console.log("Response:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleResendCode = async () => {
    if (canResend) {
      setCanResend(false);
      setTimer(120); // Set timer for 2 minutes
      localStorage.setItem('timerStartTime', Date.now().toString()); // Save timer start time

      try {
        const response = await fetch('http://localhost:3000/resend-verification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email }),
        });

        const result = await response.json();
        console.log("Resend Response:", result);
      } catch (error) {
        console.error("Error:", error);
      }
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

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1em' }}>
        <span>Didn't receive an email?</span>
        {canResend ? (
          <span
            onClick={handleResendCode}
            style={{ color: '#007BFF', cursor: 'pointer', textDecoration: 'none', marginLeft: '0.5em' }}
          >
            Resend Code
          </span>
        ) : (
          <span style={{ color: 'gray', marginLeft: '0.5em' }}>
            Please wait {Math.floor(timer / 60)}:{timer % 60 < 10 ? '0' : ''}{timer % 60} before sending another code
          </span>
        )}
      </div>
    </form>
  );
}
