import Nav from "./Nav";

const Header = () =>{
    return(
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><a href="/">Courses</a></h1>
                <Nav />
            </div>
        </header>
    );
}

export default Header;