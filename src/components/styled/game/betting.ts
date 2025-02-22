import styled from 'styled-components';
import { motion } from 'framer-motion';

export const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

export const PopupContent = styled(motion.div)`
  background: ${props => props.theme.colors.background};
  padding: ${props => props.theme.spacing.xlarge};
  border-radius: ${props => props.theme.borderRadius.large};
  width: 90%;
  max-width: 400px;
  box-shadow: ${props => props.theme.shadows.main};

  @media (max-width: 768px) {
    padding: ${props => props.theme.spacing.large};
    width: 95%;
  }
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.medium};
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${props => props.theme.spacing.small};
`;

export const Label = styled.label`
  color: ${props => props.theme.colors.text};
`;

export const Input = styled.input`
  padding: ${props => props.theme.spacing.medium};
  border-radius: ${props => props.theme.borderRadius.small};
  border: 2px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.text};
  font-size: 1rem;

  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: ${props => props.theme.spacing.medium};
  margin-top: ${props => props.theme.spacing.medium};

  // @media (max-width: 768px) {
  //   flex-direction: column;
  //   width: 100%;

  //   button {
  //     width: 100%;
  //   }
  // }
`; 