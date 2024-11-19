import React, { useEffect, useState } from 'react';
import { TEChart } from 'tw-elements-react';

export default function RadarChart({
    value,
    isOpen,
}: {
    value: {
        cohesion: number;
        syntax: number;
        vocabulary: number;
        phraseology: number;
        grammar: number;
        conventions: number;
    } | null;
    isOpen: boolean;
}): JSX.Element {
    const [animationOptions, setAnimationOptions] = useState({
        duration: 0, // No animation by default
        easing: 'easeOutQuart',
        animateRotate: false, // Disabled when isOpen is false
        animateScale: false, // Disabled when isOpen is false
    });

    // Set default values in case `value` is null or undefined
    const data = value
        ? [
              Math.min(Math.max(value.cohesion, 0), 5),
              Math.min(Math.max(value.syntax, 0), 5),
              Math.min(Math.max(value.vocabulary, 0), 5),
              Math.min(Math.max(value.phraseology, 0), 5),
              Math.min(Math.max(value.grammar, 0), 5),
              Math.min(Math.max(value.conventions, 0), 5),
          ]
        : [0, 0, 0, 0, 0, 0]; // Default to zero if value is null

    useEffect(() => {
        if (isOpen) {
            // Start animation when isOpen is true
            setAnimationOptions({
                duration: 1500, // Animation duration
                easing: 'easeOutQuart',
                animateRotate: true, // Rotate animation
                animateScale: true, // Scale animation
            });

            // Optionally, you can add a timeout for animation start if needed
            const timeout = setTimeout(() => {
                // After the timeout, set the animation options
                setAnimationOptions((prev) => ({
                    ...prev,
                    duration: 1500, // Set animation duration when isOpen is true
                    animateRotate: true,
                    animateScale: true,
                }));
            }, 50); // Add a delay before starting the animation

            return () => clearTimeout(timeout); // Clear timeout when component unmounts
        } else {
            // Disable animation when isOpen is false
            setAnimationOptions({
                duration: 0, // No animation
                easing: 'easeOutQuart',
                animateRotate: false, // No rotation
                animateScale: false, // No scaling
            });
        }
    }, [isOpen]);

    return (
        <TEChart
            type="radar"
            data={{
                labels: ['응집력', '문법', '어휘', '표현', '문법', '관습'],
                datasets: [
                    {
                        label: 'essay score',
                        data: data, // Data values are now clamped between 0 and 5
                        backgroundColor: 'rgba(0, 128, 128, 0.2)', // Teal color with transparency
                        borderColor: 'rgba(0, 128, 128, 1)', // Teal border color
                        borderWidth: 2, // Border width
                    },
                    {
                        label: '0', // Second dataset label
                        data: [0, 0, 0, 0, 0, 0], // Data values for the second dataset
                        backgroundColor: 'rgba(255, 99, 132, 0.2)', // Light red color with transparency
                        borderColor: 'rgba(255, 99, 132, 1)', // Red border color
                        borderWidth: 1, // Border width
                    },
                ],
            }}
            options={{
                animation: animationOptions, // Dynamically apply the animation options
                scale: {
                    ticks: {
                        beginAtZero: true, // Start the scale from zero
                        min: 0, // Ensure the scale starts at 0
                        max: 5, // Ensure the scale ends at 5
                    },
                },
            }}
        />
    );
}
