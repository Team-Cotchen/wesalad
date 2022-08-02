import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { RootState } from 'redux/store';
import DropdownItem from 'components/Nav/Dropdown';
import { IoMdArrowDropdown } from 'react-icons/io';

const LoginUser = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const imageUrl = useSelector((state: RootState) => state.login.imageUrl);

  useEffect(() => {
    const handleCloseMenu = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node))
        setMenuVisible(false);
    };

    document.addEventListener('click', handleCloseMenu);
    return () => document.removeEventListener('click', handleCloseMenu);
  }, [menuRef]);

  return (
    <>
      <ProfileSection
        ref={menuRef}
        onClick={() => setMenuVisible(!menuVisible)}
      >
        <img src={imageUrl} />
        <ArrowIcon size={20} />
      </ProfileSection>
      {menuVisible && <DropdownItem />}
    </>
  );
};

export default LoginUser;

const ProfileSection = styled.div`
  cursor: pointer;

  img {
    width: 2.6rem;
    height: 2.6rem;
    border-radius: 50%;
  }
`;

const ArrowIcon = styled(IoMdArrowDropdown)`
  transform: translateY(5px);
  color: grey;
  transition: all 0.2s ease-in;
  transform-origin: center 60%;
`;
