import styled from 'styled-components';

export const Vectorizer = styled.div`
  > .block-list {
    margin: 24px 0;
    display: flex;
    flex-direction: column;

    > .block-container {
      width: 100%;
      display: flex;
      align-items: center;
      margin-bottom: 12px;

      > .arrow {
        display: flex;
        flex-direction: column;

        padding: 0 24px;
        font-size: 48px;
      }

      > .col {
        flex: 1;
        img {
          object-fit: contain;
        }
      }
    }
  }

  .block-image {
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fafafa;
    height: 300px;
    min-width: 400px;

    > .ant-upload-select-picture-card {
      margin: 0;
      width: 100%;
      height: 300px;
    }
  }
`;

export const StyledBlock = styled.div`
  width: 100%;
  height: 320px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #fafafa;
  font-size: 20px;
`;
