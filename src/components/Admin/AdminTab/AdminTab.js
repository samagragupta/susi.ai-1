import React from 'react';
import _Card from '@material-ui/core/Card';
import styled, { css } from 'styled-components';
import _Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Lozenge from '../../shared/Lozenge';
import { fetchAdminUserStats, fetchAdminUserSkill } from '../../../apis/index';
import CircularLoader from '../../shared/CircularLoader';
import LineChart from '../../shared/charts/LineChart';
import moment from 'moment';
import sortByDate from '../../../utils/sortByDate';
import mergeByDate from '../../../utils/mergeByDate';

const CardHeading = styled.h3`
  padding-left: 1rem;
`;

const CardContentContainer = styled.div`
  padding: 1rem;
`;

const CardContainer = styled.span`
  font-size: 18px;
  float: left;
  margin: 0 10px;
  @media (max-width: 894px) {
    margin: 0px;
  }
  @media (max-width: 514px) {
    width: 100%;
  }
`;

const Typography = styled(_Typography)`
  @media (max-width: 441px) {
    font-size: 1rem;
  }
`;

const Container = styled.div`
  width: 840px;
  margin: auto;
  @media (min-width: 1319px) {
    ${CardContainer}:last-child {
      display: table;
      float: none;
      margin: auto;
    }
    width: 1260px;
  }
  @media (max-width: 894px) {
    width: 400px;
  }
  @media (max-width: 514px) {
    width: 80%;
  }
`;

const Card = styled(_Card)`
  width: ${props => (props.width ? props.width : '400px')};
  height: ${props => (props.height ? props.height + 'px' : '310px')};
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 2;
  ${props =>
    props.margin &&
    css`
      margin: ${props => props.margin};
      padding-right: 1rem;
    `}
  @media (max-width: 514px) {
    width: 100%;
  }
`;

const SkillCard = styled.div`
  display: flex;
  justify-content: space-around;
  margin-top: 50px;
`;

class AdminTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userStats: {},
      skillStats: {},
      loading: false,
      creationOverTime: [],
      lastAccessOverTime: [],
      lastModifiedOverTime: [],
      lastLoginOverTime: [],
      signupOverTime: [],
    };
  }

  componentDidMount() {
    Promise.all([
      fetchAdminUserStats({ getUserStats: 'true' })
        .then(payload => {
          const {
            userStats,
            lastLoginOverTime = [],
            signupOverTime = [],
          } = payload;
          this.setState({
            userStats,
            lastLoginOverTime,
            signupOverTime,
          });
        })
        .catch(error => {
          console.log(error);
        }),
      fetchAdminUserSkill()
        .then(payload => {
          const {
            skillStats,
            creationOverTime,
            lastAccessOverTime,
            lastModifiedOverTime,
          } = payload;
          this.setState({
            skillStats,
            creationOverTime,
            lastAccessOverTime,
            lastModifiedOverTime,
          });
        })
        .catch(error => {
          console.log(error);
        }),
    ])
      .then(() => {
        this.setState({ loading: false });
      })
      .catch(error => {
        console.log(error);
      });
  }

  renderCharts = () => {
    const {
      creationOverTime,
      lastAccessOverTime,
      lastModifiedOverTime,
      lastLoginOverTime,
      signupOverTime,
    } = this.state;

    const CONFIG = [
      {
        data: lastModifiedOverTime,
        heading: 'Skill Edits over Time',
        legend: 'Skill edits',
      },
      {
        data: lastAccessOverTime,
        heading: 'Skill Usage over Time',
        legend: 'Skill usage',
      },
      {
        data: creationOverTime,
        heading: 'Skill Creations over Time',
        legend: 'Skill creations',
      },
      {
        data: signupOverTime,
        heading: 'User Registrations over Time',
        legend: 'User registrations',
      },
      {
        data: lastLoginOverTime,
        heading: 'User Logins over Time',
        legend: 'User logins',
      },
    ];

    return CONFIG.map(chart => {
      if (chart.data.length > 0) {
        return this.renderChart(chart);
      }
      return null;
    });
  };

  renderChart = ({ data, heading, legend }) => {
    const dateSortedData = sortByDate(data);
    // The dateSortedData array has multiple entries for same date, add the count of same dates
    const mergedateSortedData = mergeByDate(dateSortedData);
    const chartData = mergedateSortedData.map(data => {
      const chatObj = {};
      chatObj.timestamp = moment(data.timeStamp).format('MM/YY');
      chatObj.count = data.count;
      return chatObj;
    });
    const yAxisProps = {
      domain: [0, 150],
      ticks: [0, 30, 60, 90, 120, 150],
    };

    return (
      data.length > 0 && (
        <Card height={'400'} width={'1240px'} margin={'0 10px'}>
          <CardHeading>{heading}</CardHeading>
          <LineChart
            data={chartData}
            legend={legend}
            yAxisProps={yAxisProps}
            customTooltip={true}
          />
        </Card>
      )
    );
  };

  render() {
    const {
      loading,
      userStats: {
        anonymous = 0,
        users = 0,
        reviewers = 0,
        operators = 0,
        admins = 0,
        superAdmins = 0,
        totalUsers = 0,
        activeUsers = 0,
        inactiveUsers = 0,
      },
      skillStats: {
        totalSkills = 0,
        reviewedSkills = 0,
        nonReviewedSkills = 0,
        systemSkills = 0,
        staffPicks = 0,
        editableSkills = 0,
        nonEditableSkills = 0,
      },
    } = this.state;

    return (
      <React.Fragment>
        {loading ? (
          <CircularLoader />
        ) : (
          <div style={{ margin: '1rem 0' }}>
            <Container>
              <CardContainer>
                <Card>
                  <CardHeading>User Roles</CardHeading>
                  <Divider />
                  <CardContentContainer>
                    <Typography variant="body1" gutterBottom>
                      Anonymous: {anonymous}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Users: {users}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Reviewers: {reviewers}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Operators: {operators}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Admins: {admins}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Super Admins: {superAdmins}
                    </Typography>
                  </CardContentContainer>
                </Card>
              </CardContainer>
              <CardContainer>
                <Card width={'400px'}>
                  <CardHeading>Users</CardHeading>
                  <Divider />
                  <SkillCard>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Total
                      </Typography>
                      <Lozenge color="orange" text={totalUsers} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Active
                      </Typography>
                      <Lozenge color="green" text={activeUsers} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Inactive
                      </Typography>
                      <Lozenge color="red" text={inactiveUsers} />
                    </div>
                  </SkillCard>
                </Card>
              </CardContainer>

              <CardContainer>
                <Card width={'400px'}>
                  <CardHeading>Skills</CardHeading>
                  <Divider />
                  <SkillCard>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Total
                      </Typography>
                      <Lozenge color="orange" text={totalSkills} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Reviewed
                      </Typography>
                      <Lozenge color="green" text={reviewedSkills} />
                    </div>
                    <div>
                      <Typography variant="h6" gutterBottom>
                        Not Reviewed
                      </Typography>
                      <Lozenge color="red" text={nonReviewedSkills} />
                    </div>
                  </SkillCard>
                </Card>
              </CardContainer>
              <CardContainer>
                <Card>
                  <CardHeading>Skill Types</CardHeading>
                  <Divider />
                  <CardContentContainer>
                    <Typography variant="body1" gutterBottom>
                      System Skills: {systemSkills}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Staff Picks: {staffPicks}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Editable: {editableSkills}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      Non Editable: {nonEditableSkills}
                    </Typography>
                  </CardContentContainer>
                </Card>
              </CardContainer>
              {this.renderCharts()}
            </Container>
          </div>
        )}
      </React.Fragment>
    );
  }
}

export default AdminTab;
