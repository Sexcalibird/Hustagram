import "./search.css"
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {
    fetchSearch,
    getHistory,
    getSearch,
    getSearchHistory,
    getSearchStatus
} from "../../redux/searchSlice";
import useDebounce from "../../hooks/useDebounce";
import Loading from "../../components/Loading/Loading";
import {useAuth} from "../../hooks";
import SearchResult from "./SearchResult";

const Search = ({collapse, setCollapse, selectedMenu}) => {

    const auth = useAuth()
    const dispatch = useDispatch()
    const searchResult = useSelector(getSearch)
    const searchHistory = useSelector(getSearchHistory)
    const searchStatus = useSelector(getSearchStatus)
    const refSearch = useRef()

    const [search, setSearch] =useState('')
    const debouncedSearchTerm = useDebounce(search, 1000);

    useEffect(() => {
        if (debouncedSearchTerm) {
            const promise = dispatch(fetchSearch({
                search: encodeURIComponent(search)
            }))
            return () => {
                // `createAsyncThunk` attaches an `abort()` method to the promise
                promise.abort()
            }
        }
    },[debouncedSearchTerm])

    useEffect(() => {
        if (collapse && selectedMenu === 'search') {
            dispatch(getHistory({id: auth?._id}))
        }
    },[collapse])

    const close = () => {
        setCollapse(false);
        setSearch('')
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (refSearch.current && !refSearch.current.contains(event.target)) {
                close()
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [refSearch]);

    let content;
    if (searchStatus === 'loading') {
        content = <Loading/>;
    } else if (searchStatus === 'succeeded') {
        content = searchResult.map((s,index) =>
            <SearchResult key={index} s={s} auth={auth} dispatch={dispatch} close={close} history={false}/>)
    } else if (searchStatus === 'failed') {
        content = <p>ERROR</p>;
    }

    return (
        <section>
            {(collapse && selectedMenu === 'search') && (
                <div className="search-bar" ref={refSearch}>
                    <div>
                        <h1>Search</h1>
                        <input
                            value={search}
                            placeholder="Search"
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="search-preview">
                        {!search && <h4 style={{margin: "10px 0"}}>Recent</h4> }
                        {search
                            ? content
                            : searchHistory.slice().map((s,index) =>
                                <SearchResult key={index} s={s} auth={auth} dispatch={dispatch} close={close} history={true}/>)
                        }
                    </div>
                </div>
            )}
        </section>
    )
}

export default Search