import { decorate, observable, action, computed, toJS} from 'mobx';
import axios from 'axios';

class SearchStore {
    curKeySearch = "";
    listAudio = [];
    stateRefresh = false;
    curPlay = 0;
    curToken = "";
    curId = 0;
    curFirstName = "";
    page = 0;
    page_size = 10;
    totalAudio = 0;
    endListAudio = false;
    newHeight = 0;
    setCurToken(token){
        this.curToken = token;
    }
    setCurId(id){
        this.curId = id;
    }
    setCurFirstName(name){
        this.curFirstName = name;
    }
    setTotalAudio(num){
        this.totalAudio = num;
    }
    resetToken(){
        this.curToken = "";
        this.curId = 0;
        this.curFirstName = "";
    }
    setStateRefresh(){
        this.stateRefresh = !this.stateRefresh;
    }
    getListAudio(isLoadMore = false, key){
        if(this.endListAudio) return;
        try {
            const option = {
                params: {
                    page: this.page,
                    page_size: this.page_size
                }
            }
            if(key){
                return axios
                    .get(`/api/searchdt?key=${key}`, option)
                    .then(res => {
                        console.log("res",res);
                        if(res.status === 200){
                            this.setTotalAudio(res.data.prev.total);
                            const arr = res.data.result;
                            if(!isLoadMore){
                                this.setListAudio(arr);
                            }else{
                                this.pustListAudio(arr);
                            }
                            if (!res.data.prev.hasNext) {
                                this.endListAudio = true;
                            }
                        }
                    })
                    .catch(e => {
                        console.log(e);
                    })
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    setLoadMoreAudio(key){
        this.page += 1;
        this.getListAudio(true, key)
    }
    setListAudio(list){
        this.listAudio = list;
    }
    pustListAudio(list){
        this.listAudio.push(...list);
    }
    setCurPlay(id){
        this.curPlay = id;
    }
    get ListAudio(){
        return toJS(this.listAudio);
    }
    setCurKeySearch(cur){
        this.curKeySearch = cur;
    };
    resetListAudio(){
        this.page = 0;
        this.totalAudio = 0;
        this.endListAudio = false;
        this.listAudio = [];
    }
    setNewHeight(height){
        this.newHeight = height;
    }
}
decorate(SearchStore, {
    curKeySearch: observable,
    likesCount: observable,
    listAudio: observable,
    curPlay: observable,
    curToken: observable,
    curId: observable,
    curFirstName: observable,
    page: observable,
    page_size: observable,
    endListAudio: observable,
    totalAudio: observable,
    newHeight: observable,
    updateCount: action,
    setCurKeySearch: action,
    setStateRefresh: action,
    getListAudio: action,
    setListAudio: action,
    pustListAudio: action,
    setCurPlay: action,
    setCurToken: action,
    setCurId: action,
    setCurFirstName: action,
    resetToken: action,
    setTotalAudio: action,
    ListAudio: computed,
    resetListAudio: action,
    setNewHeight: action
});

export default new SearchStore();