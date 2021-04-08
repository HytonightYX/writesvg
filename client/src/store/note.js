import { action, observable, reaction, runInAction } from 'mobx';
import { axios_get, axios_post } from '../utils/axios';

class NoteStore {
  @action
  getNotes = () => {};

  @action
  getNotesMine = () => {};
}

export default new NoteStore();
