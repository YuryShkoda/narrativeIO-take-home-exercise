import React, { useState, useEffect, useCallback } from 'react'
import AppBarMui from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Tabs from '@mui/material//Tabs'
import Tab from '@mui/material/Tab'
import { makeStyles } from 'tss-react/mui'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import palette from '../../../theme/palette'
import { appRoutes } from '../../../routes'

const useStyles = makeStyles()((theme: any) => ({
  root: {
    backgroundColor: palette.black
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  title: {
    color: palette.yellow,
    padding: '0 8px'
  },
  tabs: {
    '& .MuiTab-root': {
      fontSize: '21px',
      color: palette.gray
    },
    '& .Mui-selected': {
      color: `${palette.yellow}!important`
    }
  },
  popOverMenu: {
    '& .MuiList-padding': {
      padding: 0
    }
  },
  logoutButton: {
    justifyContent: 'center'
  }
}))

const AppBar = () => {
  const { pathname } = useLocation()

  const isPathSupported = useCallback(
    () => Object.values(appRoutes).includes(pathname.slice(1)),
    [pathname]
  )

  const getRootPath = useCallback(() => {
    switch (true) {
      case pathname.includes('order'):
        return `/${appRoutes.orders}`
      case pathname.includes('dataset'):
        return `/${appRoutes.datasets}`

      default:
        return `/${appRoutes.datasets}`
    }
  }, [pathname])

  const [tabValue, setTabValue] = useState(getRootPath)
  const { classes } = useStyles()

  useEffect(() => {
    if (isPathSupported()) {
      setTabValue(getRootPath())
    }
  }, [pathname, isPathSupported, getRootPath])

  const handleTabChange = (_: any, value: string) => {
    setTabValue(value)
  }

  return (
    <AppBarMui position="static" className={classes.root}>
      <Toolbar variant="dense">
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          className={classes.tabs}
          TabIndicatorProps={{ style: { background: palette.yellow } }}
        >
          <Tab
            label="Buy Orders"
            value={`/${appRoutes.orders}`}
            to={`/${appRoutes.orders}`}
            component={Link}
          />
          <Tab
            label="Datasets"
            value={`/${appRoutes.datasets}`}
            to={`/${appRoutes.datasets}`}
            component={Link}
          />
        </Tabs>
      </Toolbar>
    </AppBarMui>
  )
}

export default AppBar
