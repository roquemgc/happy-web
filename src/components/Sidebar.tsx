import React from 'react'

import { useHistory, Link, NavLink } from 'react-router-dom';

import mapMarkerImg from '../images/map-marker.svg';
import { FiPower, FiArrowLeft } from 'react-icons/fi'
import { FiInfo } from 'react-icons/fi'
import { FiMapPin } from 'react-icons/fi'

import '../styles/components/sidebar.css'

interface Props {
  dashboard?: boolean;
}
export default function Sidebar(props: Props) {
    const { goBack } = useHistory();

    return (
      <aside className="app-sidebar">
        { props.dashboard ? (
          <div className="sidebar-itens">
            <img src={mapMarkerImg} alt="Happy" />
            <nav className="dashboard-itens">
              <NavLink
                to="/dashboard"
                activeClassName="selected"
                exact={true}
              >
                <FiMapPin size={24} color="#FFF" />
              </NavLink>
              <NavLink
                to="/dashboard/pending-registrations"
                activeClassName="selected"
              >
                <FiInfo size={24} color="#FFF" />
              </NavLink>
            </nav>

            <footer>
              <Link to="/login">
                <FiPower size={24} color="#FFF" />
              </Link>
            </footer>
          </div>
        ): (
          <div className="sidebar-itens">
            <img src={mapMarkerImg} alt="Happy" />
            <footer>
              <button type="button" onClick={goBack}>
                <FiArrowLeft strokeWidth={3} size={24} color="#FFF" />
              </button>
            </footer>
          </div>

        )}
      </aside>
    );
}