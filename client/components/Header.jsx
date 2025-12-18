import Nav from "./Nav";

const Header = () =>{
    return(
        <header>
            <div className="wrap header--flex">
                <h1 className="header--logo"><a href="/">Courses</a></h1>
                <link rel="stylesheet" href="/styles/reset.css" />
                <link rel="stylesheet" href="/styles/global.css" />
                <Nav />
            </div>
        </header>
    );
}

export default Header;