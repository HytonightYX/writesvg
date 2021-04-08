import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  background: #292525;
  z-index: 400;
  top: 0;
  left: 0;
  height: 60px;

  .m-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #292525;
    margin: 0 auto;
    max-width: 1120px;
    height: 60px;

    .ui.menu {
      margin: 0;
    }

    .m-menu {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
    }

    .nav-right {
      width: 100px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 !important;

      .user-icon img {
        width: 36px;
        height: 36px;
        margin: 0 10px;
        border-radius: 36px;
      }

      .m-icon {
        color: #f5f5f5;
        margin: 0 10px;
      }

      .m-login_btn {
        background: #f5f5f5;
        color: #655e5e;
        padding: 5px 12px;
        border-radius: 24px;
        border: none;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        font-size: 1rem;
        text-align: center;
        letter-spacing: 0.1em;
        cursor: pointer;
        outline: none;
      }

      .m-login_btn:hover {
        background: #fff;
        color: #292525;
      }
    }

    .ui.secondary.inverted.pointing.menu .active.item {
      color: #f5f5f5 !important;
    }

    .m-logo {
      display: flex;
      flex-direction: column-reverse;
      padding-right: 10px;
      img {
        height: 30px;
      }
    }
  }
`;

export const HeaderContainer = styled.div`
  
`;
