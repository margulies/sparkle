import React, { useState } from "react";
import WithNavigationBar from "components/organisms/WithNavigationBar";
import UserList from "components/molecules/UserList";
import TablesUserList from "components/molecules/TablesUserList";
import TabNavigation from "components/molecules/TabNavigation";
import InformationCard from "components/molecules/InformationCard";
import Chatbox from "components/organisms/Chatbox";
import InformationLeftColumn from "components/organisms/InformationLeftColumn";
import Room from "components/organisms/Room";
import { useSelector } from "react-redux";
import { User } from "types/User";
import JazzbarTableComponent from "components/molecules/JazzbarTableComponent";

interface PropsType {
  userList: any;
  selectedTab: string;
  children: React.ReactNode;
  setSelectedTab: (value: string) => void;
  setUserList: any;
}

const JazzBarSkeletonPage: React.FunctionComponent<PropsType> = ({
  userList,
  selectedTab,
  children,
  setSelectedTab,
  setUserList,
}) => {
  const [seatedAtTable, setSeatedAtTable] = useState("");
  let activity = "";
  if (selectedTab === "cocktail") {
    activity = "at the bar";
  }
  if (selectedTab === "smoking") {
    activity = "in the smoking area";
  }

  const { users } = useSelector((state: any) => ({
    users: state.firestore.ordered.users,
  }));

  return (
    <WithNavigationBar>
      <div className="full-page-container experience-container">
        <InformationLeftColumn experienceLogoPath="/kansas-smittys-logo-red.png">
          <InformationCard title="About the venue">
            Kansas Smitty’s is East London’s most dynamic jazz venue. Located on
            Broadway Market, it opens six nights a week for live jazz in an
            intimate basement environment. Their seven-piece house band share
            the name. The signature cocktail in this cult bar, the julep, is a
            bourbon-based cocktail served in an ice-filled tin, and recalls the
            jazzy bars of 1920s Kansas where the likes of Mary Lou Williams gave
            us new ways of hearing.
          </InformationCard>
          <InformationCard
            title="About tonight's show"
            className="information-card"
          >
            <p>Performing tonight at Kansas Smitty's:</p>
            <ul>
              <li>Giacomo Smith - alto/clarinet</li>
              <li>Alec harper - Tenor</li>
              <li>Dave Archer - Guitar</li>
              <li>Joe Webb - Piano</li>
              <li>Ferg Ireland - Double Bass</li>
              <li>Will Cleasby - Drums</li>
            </ul>
            <p>Broadcasting live from their East London home.</p>
          </InformationCard>
        </InformationLeftColumn>
        <div className="content">{children}</div>
        <div className="right-column">
          <TabNavigation
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
          />
          <div className="right-column-content">
            {userList && (
              <div className="user-list">
                {selectedTab === "jazz" ? (
                  <>
                    <div className="row header no-margin">
                      <p>
                        <span className="bold">
                          {users &&
                            users.filter(
                              (user: User) =>
                                user.data &&
                                user.data["kansassmittys"] &&
                                !user.data["kansassmittys"].table
                            ).length}
                        </span>{" "}
                        {users &&
                        users.filter(
                          (user: User) =>
                            user.data &&
                            user.data["kansassmittys"] &&
                            !user.data["kansassmittys"].table
                        ).length !== 1
                          ? "people"
                          : "person"}{" "}
                        listening to jazz
                      </p>
                    </div>
                    <div className="table-container">
                      <TablesUserList
                        experienceName="kansassmittys"
                        seatedAtTable={seatedAtTable}
                        setSeatedAtTable={setSeatedAtTable}
                        TableComponent={JazzbarTableComponent}
                      />
                      {seatedAtTable !== "" && (
                        <>
                          <div className="wrapper">
                            <Room
                              roomName={seatedAtTable}
                              setUserList={setUserList}
                            />
                          </div>
                          <div className="header">
                            <UserList
                              users={users.filter(
                                (user: User) =>
                                  user.data &&
                                  user.data["kansassmittys"] &&
                                  user.data["kansassmittys"].table &&
                                  user.data["kansassmittys"].table !==
                                    seatedAtTable
                              )}
                              activity="on other tables"
                              disableSeeAll
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  <UserList users={userList} activity={activity} limit={24} />
                )}
                <div className="row no-margin">
                  <UserList
                    users={users ? users : []}
                    limit={22}
                    activity="standing"
                    disableSeeAll
                  />
                </div>
              </div>
            )}
            <Chatbox room={selectedTab} />
          </div>
        </div>
      </div>
    </WithNavigationBar>
  );
};

export default JazzBarSkeletonPage;
