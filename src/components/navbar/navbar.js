import React, { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { Menu, MenuButton, MenuList, MenuItem, Button } from "@chakra-ui/react";
import axios from "axios";
import styles from "./styles.module.css";

const Navbar = () => {
  const { data: session, status } = useSession();
  const [userBalance, setUserBalance] = useState(null);

  useEffect(() => {
    if (!session?.user) return;

    const headers = {
      "Content-Type": "application/json",
      "X-Api-Key": session.user.in_key,
    };

    axios
      .get(`https://legend.lnbits.com/api/v1/wallet`, {
        headers,
      })
      .then((res) => {
        console.log("user wallet res", res);

        setUserBalance(res.data.balance / 1000);
      })
      .catch((err) => {
        console.log("user wallet err");
        console.log(err);
      });
  }, [session]);

  return (
    <div className={styles.navbar}>
      <Menu>
        <MenuButton as={Button}>Menu</MenuButton>
        <MenuList>
          <MenuItem>Posts</MenuItem>
          <MenuItem>Users</MenuItem>
          <MenuItem>Profile</MenuItem>
        </MenuList>
      </Menu>

      <div className={styles.userInfo}>
        <span>{status}</span>
        <span>{session?.user.username}</span>
        <span>{userBalance}</span>

        <Button
          colorScheme={status !== "authenticated" ? "blue" : "red"}
          onClick={() => (status !== "authenticated" ? signIn() : signOut())}
        >
          {status !== "authenticated" ? "login" : "logout"}
        </Button>
      </div>
    </div>
  );
};

export default Navbar;
