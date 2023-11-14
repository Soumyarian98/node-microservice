import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react'

const Header = ({ currentUser }) => {
  const route = useRouter();
  const onSignOut = async () => {
    await axios.post('/api/users/signout', {});
    route.push('/');
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-4">
      <Link className="navbar-brand h1 mr-auto" href="/">Ticketing</Link>
      <div className="flex-grow-1"></div>
      <ul className="navbar-nav ml-auto">

        {currentUser ?
          <>
            <li>
              <Link className="nav-link" href="/order">My Orders</Link>
            </li>
            <li>
              <Link className="nav-link" href="/ticket/new">Sell Tickets</Link>
            </li>
            <li className="nav-item">
              <button type="button" class="btn btn-primary btn-sm" onClick={onSignOut}>Sign Out</button>
            </li>
          </>
          : <>
            <li className="nav-item">
              <Link className="nav-link" href="/auth/signin">Sign In</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" href="/auth/signup">Sign Up</Link>
            </li>
          </>}

      </ul>

    </nav>
  )
}

export default Header