import React, { forwardRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'gatsby'

import { shouldNavigate } from '../utils/shouldNavigate'
import { triggerTransition } from '../utils/triggerTransition'
import { Consumer } from '../context/createTransitionContext'

if (typeof forwardRef === 'undefined') {
	forwardRef = C => C
}

const TransitionLink = forwardRef(
	(
		{
			to,
			children,
			exit,
			entry,
			activeStyle,
			partiallyActive,
			style,
			className,
			activeClassName,
			state,
			onClick,
			trigger,
			replace,
			innerRef,
			preventScrollJump,
			...rest
		},
		ref
	) => {
		return (
			<Consumer>
				{({ disableAnimation, ...context }) => (
					<Link
						style={style}
						activeStyle={activeStyle}
						className={className}
						activeClassName={activeClassName}
            partiallyActive={partiallyActive}
            getProps={({ isPartiallyCurrent, isCurrent }) => {
              if (partiallyActive ? isPartiallyCurrent : isCurrent) {
                return {
                  className: [className, activeClassName]
                    .filter(Boolean)
                    .join(` `),
                  style: { ...style, ...activeStyle },
                };
              }
              return null;
            }}
						onClick={event => {
							// If the user has set their browser or OS to prefers-reduced-motion
							// we should respect that.
							if (disableAnimation) {
								return
							}

							const weShouldNavigate = shouldNavigate(event)

							if (weShouldNavigate) {
								triggerTransition({
									event,
									to,
									exit,
									entry,
									trigger,
									replace,
									preventScrollJump,
									linkState: state,
									...context,
								})
							}

							if (typeof onClick === 'function') {
								onClick(event, weShouldNavigate)
							}
            }}
            ref={ref || innerRef}
						{...rest}>
						{children}
					</Link>
				)}
			</Consumer>
		)
	}
)

TransitionLink.propTypes = {
	to: PropTypes.string.isRequired,
	exitLength: PropTypes.number,
	entryDelay: PropTypes.number,
	exitFn: PropTypes.func,
	entryState: PropTypes.object,
}

export { TransitionLink };