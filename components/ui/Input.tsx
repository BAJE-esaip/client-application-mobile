// components/ui/Input.tsx

import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
    // Définir ici les props que vous utiliserez
}

export const Input: React.FC<CustomInputProps> = (props) => {
    return (
        <TextInput
            {...props}
        />
    );
};